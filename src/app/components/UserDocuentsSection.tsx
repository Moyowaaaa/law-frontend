import React, { useContext, useEffect, useState } from "react";
import DocumentCard from "./DocumentCard"; // Import DocumentCard component
import { document } from "./DocumentsSection";
import { AuthContext } from "@/context/AuthContext";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import Loader from "./Loader";
import toast from "react-hot-toast";
import searchIcon from "../../../public/images/search.svg";
import Image from "next/image";

const UserDocumentsSection = () => {
  const [documents, setDocuments] = useState<document[]>([]);
  const [bookMarkedDocuments, setBookMarkedDocuments] = useState<string[]>([]);
  const { currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserBookmarks = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setBookMarkedDocuments(userData.savedDocuments || []);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookmarks();

    const collectionRef = collection(db, "documents");
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as document[];
      setDocuments(docs);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredDocuments = documents.filter((doc) =>
    bookMarkedDocuments.includes(doc.id)
  );

  const onToggleBookmark = async (documentId: string) => {
    if (!currentUser) return;

    try {
      setIsLoading(true);

      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        let updatedSavedDocuments: string[];

        if (userData.savedDocuments.includes(documentId)) {
          updatedSavedDocuments = userData.savedDocuments.filter(
            (id: any) => id !== documentId
          );
          toast.success(`Unsaved`);
        } else {
          updatedSavedDocuments = [...userData.savedDocuments, documentId];
          toast.success(`Saved`);
        }

        await updateDoc(userDocRef, { savedDocuments: updatedSavedDocuments });

        setBookMarkedDocuments(updatedSavedDocuments);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mt-8 flex w-8/12 border-2 border-[#EAECF0] items-center rounded-lg gap-4 lg:pl-4 py-2 bg-[transparent]">
        <div className="min-w-max">
          <Image src={searchIcon} alt="" />
        </div>
        <input
          type="text"
          placeholder="Search for draft"
          className="w-full border-none bg-[transparent] outline-none"
        />
      </div>
      {isLoading ? (
        <div className="w-full flex items-center h-[30rem]">
          <Loader />
        </div>
      ) : (
        <div className="w-full py-4 ">
          {filteredDocuments.length === 0 ? (
            <p>No bookmarked documents yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredDocuments.map((document) => (
                <DocumentCard
                  setIsLoading={setIsLoading}
                  key={document.id}
                  document={document}
                  isBookmarked={true}
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

export default UserDocumentsSection;
