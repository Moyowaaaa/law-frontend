"use client";
import { Inter } from "next/font/google";
import React, { useContext, useState } from "react";
import DocumentCard from "../components/DocumentCard";
import searchIcon from "../../../public/images/search.svg";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import { AuthContext } from "@/context/AuthContext";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import DocumentsSection from "../components/DocumentsSection";
import SelectCategory from "../components/SelectCategory";
import toast from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], weight: "800" });

const Admin = () => {
  const openFileUploader = () => {
    document.getElementById(`doc-uploader`)?.click();
  };
  const { currentUser } = useContext(AuthContext);
  const [adminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fileToBeUploaded, setFileToBeUploaded] = useState<File | null>(null);

  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [fileUploadProgress, setFileUploadProgress] = useState<number>(0);

  const signInAdmin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setIsAdminLoggedIn(true);
    } catch (error) {
      setIsAdminLoggedIn(false);
      console.log("Error signing in:", error);
    }
  };

  const uploadDocument = async (file: File) => {
    console.log({ file });
    setFileToBeUploaded(file);
  };

  const finishUpload = async () => {
    try {
      if (!fileToBeUploaded || !title || !category) {
        console.error("File or document details are missing");
        toast.error(`Please check document details and try again `, {
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
          toast.error(`An error occurred while uploading `, {
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
              // Category exists, update documentsCount
              const categoryDoc = querySnapshot.docs[0];
              const categoryDocRef = doc(db, "categories", categoryDoc.id);
              const currentCount = categoryDoc.data().documentsCount || 0;
              await updateDoc(categoryDocRef, {
                documentsCount: currentCount + 1,
              });
            } else {
              // Category doesn't exist, create new category with documentsCount = 1
              await addDoc(categoriesCollectionRef, {
                name: category,
                documentsCount: 1,
                createdAt: serverTimestamp(),
              });
            }

            await updateDoc(docRef, { documentId: docRef.id });
            console.log("File info added to Firestore with ID:", docRef.id);
            toast.success(`Document uploaded successfully`, {
              duration: 5000,
            });
            setFileUploadProgress(0);
            setFileToBeUploaded(null);
            setTitle("");
            setCategory("");
          } catch (error) {
            console.error("Error adding file info to Firestore", error);
            toast.error(`An error occurred, please try again `, {
              duration: 5000,
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!adminLoggedIn ? (
        <div className="px-4 lg:px-20  flex flex-col gap-10 items-center justify-center h-screen absolute top-0 left-0 w-full">
          <h1 className={`text-[#344054] text-[2rem] ${inter.className}`}>
            Admin Login
          </h1>

          <div className="flex flex-col gap-2 w-[18rem]">
            <p>Email</p>
            <div className=" flex w-full border-2 border-[#EAECF0] items-center rounded-lg gap-4 pl-4 py-2 bg-[transparent]">
              <input
                type="text"
                placeholder=""
                className="w-full border-none bg-[transparent] outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 w-[18rem]">
            <p>Password</p>
            <div className="px-2 flex w-full border-2 border-[#EAECF0] items-center rounded-lg gap-4 pl-4 py-2 bg-[transparent]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder=""
                className="w-full border-none bg-[transparent] outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? `Hide` : `Show`}
              </p>
            </div>
          </div>
          <button
            onClick={() => signInAdmin()}
            className="flex items-center justify-center gap-4 border-2 px-4 py-2 border-[#EAECF0] bg-[#333333] rounded-lg text-[#ffffff] min-w-max"
          >
            Sign In as Admin
          </button>
        </div>
      ) : (
        <div className="px-4 lg:px-20  flex flex-col gap-10 w-9/12">
          <h1 className={`text-[#344054] text-[2rem] ${inter.className}`}>
            Admin
          </h1>

          <input
            type="file"
            className="invisible"
            id="doc-uploader"
            onChange={(e: any) => uploadDocument(e.target.files[0])}
          />
          <div className="flex gap-4 items-center" id="uploader">
            <div className="flex flex-col gap-2 justify-start">
              <div
                className="flex items-center justify-center w-[10rem] h-[10rem] text-5xl border-2 border-[#344054]"
                onClick={() => openFileUploader()}
              >
                +
              </div>
              <div
                className=" border-2 border-[#333333] bg-[#333333]"
                style={{ width: `${fileUploadProgress}%`, height: "10px" }}
              ></div>
            </div>
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
              <div className="flex flex-col gap-2">
                {/* <div className=" flex w-full border-2 border-[#EAECF0] items-center rounded-lg gap-4 pl-4 py-2 bg-[transparent]">
                  <input
                    type="text"
                    placeholder=""
                    className="w-full border-none bg-[transparent] outline-none"
                    value={documentDetails.tag}
                    onChange={(e) =>
                      setDocumentDetails({
                        ...documentDetails,
                        tag: e.target.value,
                      })
                    }
                  />
                </div> */}
                <SelectCategory setCategory={setCategory} />
              </div>
              <button
                onClick={finishUpload}
                className="px-4 py-2 bg-[#333333] rounded-lg text-[#ffffff] min-w-ma"
              >
                Upload
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1>Manage Documents</h1>
            <hr />
            <div className="mt-8 flex w-full border-2 border-[#EAECF0] items-center rounded-lg gap-4 pl-4 py-2 bg-[transparent]">
              <div className="min-w-max">
                <Image src={searchIcon} alt="" />
              </div>
              <input
                type="text"
                placeholder="Search for document"
                className="w-full border-none bg-[transparent] outline-none"
              />
            </div>
            <DocumentsSection />
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
