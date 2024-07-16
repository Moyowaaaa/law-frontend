import { db } from "@/firebase/firebaseConfig";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { SetStateAction, useRef, useState } from "react";
import toast from "react-hot-toast";
import { category } from "../types/types";

const CreateCategoryModal = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useOnClickOutside(modalRef, () => setShowModal(false));

  console.log({ categories });

  const onAddCategories = async () => {
    try {
      setIsLoading(true);

      for (const category of categories) {
        const newCategoryDocRef = await addDoc(collection(db, "categories"), {
          name: category,
          createdAt: serverTimestamp(),
        });

        await updateDoc(newCategoryDocRef, { id: newCategoryDocRef.id });
      }

      toast.success(
        `${
          categories.length > 1 ? `Categories` : `Category`
        } added successfully`
      );
      setCategories([]);
      setIsLoading(false);

      setShowModal(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      toast.error("An error occurred, please try again");
    }
  };

  return (
    <div className="fixed h-screen w-full top-0 left-0 flex items-center justify-center z-10">
      <div className="overlay h-full w-full bg-white fixed -z-10"></div>
      <div
        className="content w-full lg:w-[30rem] bg-white h-[18rem] relative z-50 flex flex-col gap-4 p-4"
        ref={modalRef}
      >
        <div
          className="w-full py-2 flex items-center cursor-pointer justify-end"
          onClick={() => setShowModal(false)}
        >
          X
        </div>

        <p className="font-lg font-bold">Categories</p>
        <div className="flex w-full border-2 border-[#EAECF0] items-center rounded-lg gap-4 pl-4 py-2 bg-[transparent]">
          <input
            type="text"
            placeholder="Add multiple categories by separating with commas"
            className="w-full border-none bg-[transparent] outline-none"
            onChange={(e) => {
              const input = e.target.value;
              const categoriesArray = input
                .split(",")
                .map((category) => category.trim());
              setCategories(categoriesArray);
            }}
          />
        </div>
        <button
          onClick={() => onAddCategories()}
          disabled={isLoading}
          className={`px-4 py-2 bg-[#333333] rounded-lg text-[#ffffff] min-w-max flex items-center justify-center max-h-[3rem]
            ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}
            `}
        >
          {isLoading ? `Adding` : `Add`}{" "}
          {categories.length > 1 ? `categories` : `category`}
        </button>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
