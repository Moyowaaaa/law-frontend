import React, { useContext, useEffect, useState } from "react";
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
};

export interface UserData {
  savedDocuments: string[];
}

const DocumentsSection = () => {
  const [documents, setDocuments] = useState<document[]>([]);
  const [bookMarkedDocuments, setBookMarkedDocuments] = useState<string[]>([]);
  const { currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);

      const fetchUserBookmarks = async () => {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as UserData;
            setBookMarkedDocuments(userData.savedDocuments || []);
          }
        } catch (error) {
          console.log(error);
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
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full py-4">
          {documents.length === 0 ? (
            <p>No documents yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {documents.map((document) => (
                <DocumentCard
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
