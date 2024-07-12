import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import toast from "react-hot-toast";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import uploadIcon from "../../../public/images/uploadIcon.png";
import Image from "next/image";
import SelectCategory from "./SelectCategory";

const UploadModal = ({
  openUploadModal,
  setOpenUploadModal,
}: {
  openUploadModal: boolean;
  setOpenUploadModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [fileToBeUploaded, setFileToBeUploaded] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [fileUploadProgress, setFileUploadProgress] = useState<number>(0);

  const uploadDocument = (file: File) => {
    setFileToBeUploaded(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      uploadDocument(files[0]);
    }
  };

  const finishUpload = async () => {
    try {
      if (!fileToBeUploaded || !title || !category) {
        console.error("File or document details are missing");
        toast.error("Please check document details and try again", {
          duration: 5000,
        });
        return;
      }

      const storage = getStorage();
      const storageRef = ref(storage, `documents/${fileToBeUploaded.name}`);
      const uploadTask = uploadBytesResumable(storageRef, fileToBeUploaded);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileUploadProgress(progress);
          console.log("Upload is " + progress + "% done");

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error("Upload failed", error);
          toast.error("An error occurred while uploading", {
            duration: 5000,
          });
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const docRef = await addDoc(collection(db, "documents"), {
              fileName: title,
              category: category,
              documentName: fileToBeUploaded.name,
              downloadURL: downloadURL,
              downloadCount: 0,
              createdAt: serverTimestamp(),
            });

            const categoriesCollectionRef = collection(db, "categories");
            const q = query(
              categoriesCollectionRef,
              where("name", "==", category)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const categoryDoc = querySnapshot.docs[0];
              const categoryDocRef = doc(db, "categories", categoryDoc.id);
              const currentCount = categoryDoc.data().documentsCount || 0;
              await updateDoc(categoryDocRef, {
                documentsCount: currentCount + 1,
              });
            } else {
              await addDoc(categoriesCollectionRef, {
                name: category,
                documentsCount: 1,
                createdAt: serverTimestamp(),
              });
            }

            await updateDoc(docRef, { documentId: docRef.id });
            console.log("File info added to Firestore with ID:", docRef.id);
            toast.success("Document uploaded successfully", {
              duration: 5000,
            });
            setFileUploadProgress(0);
            setFileToBeUploaded(null);
            setTitle("");
            setCategory("");
            setOpenUploadModal(false);
          } catch (error) {
            console.error("Error adding file info to Firestore", error);
            toast.error("An error occurred, please try again", {
              duration: 5000,
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const dropzoneContainer: any = document.querySelector("#dropzone");
    dropzoneContainer.addEventListener("dragover", (e: any) => {
      e.preventDefault();
      dropzoneContainer.classList.add("dragging");
    });

    dropzoneContainer.addEventListener("drop", (e: any) => {
      e.preventDefault();
      dropzoneContainer.classList.remove("dragging");
      handleDrop(e);
    });

    dropzoneContainer.addEventListener("dragleave", () => {
      dropzoneContainer.classList.remove("dragging");
    });
  }, []);

  useOnClickOutside(modalRef, () => setOpenUploadModal(false));

  return (
    <div className="fixed h-screen w-full top-0 left-0 flex items-center justify-center z-10">
      <div className="overlay h-full w-full bg-white fixed -z-10"></div>
      <div
        className="content w-full lg:w-[30rem] bg-white h-max relative z-50 flex flex-col gap-4 p-4"
        ref={modalRef}
      >
        <div
          className="w-full  py-2 flex items-center cursor-pointer justify-end"
          onClick={() => setOpenUploadModal(false)}
        >
          X
        </div>
        <input
          type="file"
          className="invisible"
          id="doc-uploader"
          onChange={(e: any) => uploadDocument(e.target.files[0])}
        />
        <div
          id="dropzone"
          className="flex w-full border-2 rounded-lg h-[10rem] mx-auto flex-col items-center"
          onClick={() => document.getElementById(`doc-uploader`)?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => e.currentTarget.classList.remove("dragging")}
        >
          {fileUploadProgress > 0 && (
            <div
              className=" border-2 border-[#333333] bg-[#333333]"
              style={{ width: `${fileUploadProgress}%`, height: "2px" }}
            ></div>
          )}

          <div className="w-[3rem] h-[3rem] mx-auto mt-6">
            <Image
              src={uploadIcon}
              alt="Upload Icon"
              width={0}
              height={0}
              className="w-full h-full object-fit"
            />
          </div>
          {!fileToBeUploaded ? (
            <div className="flex flex-col gap-2 items-center">
              <p>Click to upload or drag and drop a document</p>
              <small>(Pdf.)</small>
            </div>
          ) : (
            <div className="flex">{fileToBeUploaded?.name}</div>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-2">
            <p>Name</p>
            <div className=" flex w-full border-2 border-[#EAECF0] items-center rounded-lg gap-4 pl-4 py-2 bg-[transparent]">
              <input
                type="text"
                placeholder=""
                className="w-full border-none bg-[transparent] outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <SelectCategory setCategory={setCategory} />

          <button
            onClick={finishUpload}
            className="px-4 py-2 bg-[#333333] rounded-lg text-[#ffffff] min-w-ma"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
