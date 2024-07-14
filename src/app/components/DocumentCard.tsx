import React, { useState } from "react";
import bookmarkIcon from "../../../public/images/bookmark.svg";
import bookmarkedIcon from "../../../public/images/bookmarked.svg";
import downloadIcon from "../../../public/images/download.svg";
import Image from "next/image";
import { Inter } from "next/font/google";
import DocumentViewerModal from "./DocumentViewerModal";
import { document } from "./DocumentsSection";
import {
  format,
  isToday,
  isYesterday,
  isThisYear,
  isThisWeek,
  isThisMonth,
} from "date-fns";
import { convertFirestoreTimestampToDate } from "../../../utils";
import { deleteObject, getStorage, ref } from "firebase/storage";
import {
  doc,
  deleteDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export function formatDate(timestamp: any): string {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (isThisWeek(date)) {
    return format(date, "EEEE");
  } else if (isThisMonth(date)) {
    return format(date, "MMMM d");
  } else if (isThisYear(date)) {
    return format(date, "MMMM");
  } else {
    return format(date, "MMMM d, yyyy");
  }
}

const DocumentCard = ({
  document,
  isBookmarked,
  onToggleBookmark,
}: {
  document: document;
  isBookmarked: boolean;
  onToggleBookmark: (documentId: string) => void;
}) => {
  const [openPreviewModal, setOpenPreviewModal] = useState<boolean>(false);
  const pathname = usePathname();

  const openPreview = () => {
    setOpenPreviewModal(true);
  };

  const formattedDate = formatDate(
    convertFirestoreTimestampToDate(document.createdAt)
  );

  const onDownloadDocument = async (filePath: string) => {
    try {
      const documentRef = doc(db, "documents", document.id);
      await updateDoc(documentRef, {
        ...document,
        downloadCount: document.downloadCount + 1,
      });

      const url = filePath;
      const link = window.document.createElement("a");
      link.target = "_blank";
      link.href = url;
      link.download = `${document.documentName}.pdf`;
      link.click();
      toast.success(`Downloading ${document.fileName}`, {
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteDocument = async () => {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, `documents/${document.documentName}`);
      const documentRef = doc(db, "documents", document.id);

      const categoriesCollectionRef = collection(db, "categories");

      const q = query(
        categoriesCollectionRef,
        where("name", "==", document.category)
      );
      toast.success(`Successfully deleted document`);
      console.log("deleted");
      const querySnapshot = await getDocs(q);
      const categoryDoc = querySnapshot.docs[0];
      const categoryDocRef = doc(db, "categories", categoryDoc.id);
      const currentCount = categoryDoc.data().documentsCount || 0;
      await updateDoc(categoryDocRef, {
        documentsCount: currentCount - 1,
      });

      await deleteObject(fileRef);
      await deleteDoc(documentRef);
    } catch (error) {
      console.log(error);
      toast.error(`An error occurred, please try again.`);
    }
  };

  return (
    <>
      {openPreviewModal && (
        <DocumentViewerModal
          openPreviewModal={openPreviewModal}
          setOpenPreviewModal={setOpenPreviewModal}
          onDownloadDocument={onDownloadDocument}
          document={document}
          documents={[
            {
              uri: document.downloadURL,
              fileName: document.fileName,
            },
          ]}
        />
      )}
      <div className="w-full py-4 flex flex-col border-[#EAECF0] text-[#667085] border-b-2 text-[0.875rem] cursor-pointer">
        <div className="flex items-end justify-between w-full">
          <div className={`flex flex-col gap-2 `} onClick={openPreview}>
            <p className={` text-[#101828]`}>{document.fileName}</p>
            <p>{document.category}</p>

            <div className="mt-6">
              <p>Uploaded: {formattedDate}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center justify-end">
              {pathname !== "/admin" && (
                <Image
                  src={isBookmarked ? bookmarkedIcon : bookmarkIcon}
                  alt="Bookmark Icon"
                  onClick={() => onToggleBookmark(document.id)}
                />
              )}

              <Image
                src={downloadIcon}
                alt="Download Icon"
                onClick={() => onDownloadDocument(document.downloadURL)}
              />
              {pathname === "/admin" && (
                <button
                  onClick={() => onDeleteDocument()}
                  className="py-2 px-4 text-[red] font-bold"
                >
                  Delete
                </button>
              )}
            </div>

            <div className="mt-6">
              {document.downloadCount > 0 && (
                <p>
                  {document.downloadCount} Download
                  {document.downloadCount > 1 && `s`}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentCard;
