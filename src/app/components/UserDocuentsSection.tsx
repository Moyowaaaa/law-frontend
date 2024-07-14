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

const UserDocumentsSection = () => {
  const [documents, setDocuments] = useState<document[]>([]);
  const [bookMarkedDocuments, setBookMarkedDocuments] = useState<string[]>([]);
  const { currentUser } = useContext(AuthContext);

  // Fetch user bookmarks
  const fetchUserBookmarks = async () => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setBookMarkedDocuments(userData.savedDocuments || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch documents from Firestore
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

  // Filter documents to show only bookmarked ones
  const filteredDocuments = documents.filter((doc) =>
    bookMarkedDocuments.includes(doc.id)
  );

  const onToggleBookmark = async (documentId: string) => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        let updatedSavedDocuments: string[];

        if (userData.savedDocuments.includes(documentId)) {
          // Unbookmark if already bookmarked
          updatedSavedDocuments = userData.savedDocuments.filter(
            (id: any) => id !== documentId
          );
        } else {
          // Bookmark if not already bookmarked
          updatedSavedDocuments = [...userData.savedDocuments, documentId];
        }

        // Update Firestore with the new savedDocuments array
        await updateDoc(userDocRef, { savedDocuments: updatedSavedDocuments });

        // Update local state
        setBookMarkedDocuments(updatedSavedDocuments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full py-4">
      {filteredDocuments.length === 0 ? (
        <p>No bookmarked documents yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDocumentsSection;
