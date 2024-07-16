import React, {
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import DocumentCard from "./DocumentCard";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { AuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { category } from "../types/types";
import { usePathname } from "next/navigation";

export type document = {
  createdAt: {
    TimeStamp: { seconds: number; nanoseconds: number };
  };
  documentName: string;
  downloadCount: number;
  downloadURL: string;
  fileName: string;
  id: string;
  category: string;
  documentId: string;
};

export interface UserData {
  savedDocuments: string[];
}

const DocumentsSection = ({
  selectedCategories,
}: {
  selectedCategories?: string[];
}) => {
  const pathname = usePathname();
  const [documents, setDocuments] = useState<document[]>([]);
  const [bookMarkedDocuments, setBookMarkedDocuments] = useState<string[]>([]);
  const { currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);

      const fetchUserBookmarks = async () => {
        try {
          setIsLoading(true);

          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as UserData;
            setBookMarkedDocuments(userData.savedDocuments || []);
          }
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      };
      fetchUserBookmarks();
    }

    const collectionRef = collection(db, "documents");
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as document[];
      setDocuments(docs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const onToggleBookmark = async (documentId: string) => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as UserData;
        let updatedSavedDocuments: string[];

        if (userData.savedDocuments.includes(documentId)) {
          updatedSavedDocuments = userData.savedDocuments.filter(
            (id) => id !== documentId
          );
          toast.success(`Unsaved`);
        } else {
          updatedSavedDocuments = [...userData.savedDocuments, documentId];
          toast.success(`Saved`);
        }

        await updateDoc(userDocRef, { savedDocuments: updatedSavedDocuments });
        setBookMarkedDocuments(updatedSavedDocuments);
      }
    } catch (error) {
      console.log(error);
      toast.error(`An error occurred, please try again.`);
      setIsLoading(false);
    }
  };

  const filteredDocuments = useMemo(() => {
    if (selectedCategories && selectedCategories.length === 0) return documents;

    if (pathname === "/admin") {
      return documents;
    } else {
      return documents.filter(
        (doc) =>
          selectedCategories &&
          selectedCategories.includes(doc.category.toLowerCase())
      );
    }
  }, [documents, selectedCategories]);

  console.log({ selectedCategories });

  return (
    <>
      {isLoading ? (
        <div className="h-[30rem] w-full">
          <Loader />
        </div>
      ) : (
        <div className="w-full py-4">
          {filteredDocuments.length === 0 ? (
            <p>No documents found.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredDocuments.map((document) => (
                <DocumentCard
                  setIsLoading={setIsLoading}
                  key={document.id}
                  document={document}
                  isBookmarked={bookMarkedDocuments.includes(document.id)}
                  onToggleBookmark={onToggleBookmark}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DocumentsSection;
