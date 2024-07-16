"use client";

import { Inter } from "next/font/google";
import React, { useEffect, useState } from "react";
import { category } from "../types/types";
import CategoryCard from "../components/CategoryCard";
import { collection, onSnapshot, orderBy } from "firebase/firestore";
import SelectCategory from "../components/SelectCategory";
import Loader from "../components/Loader";

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import toast from "react-hot-toast";
import CreateCategoryModal from "./CreateCategoryModal";

const CategoriesSection = () => {
  const [categories, setCategories] = useState<category[]>([]);
  const [searchedCategory, setSearchedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    const collectionRef = collection(db, "categories");
    orderBy("createdAt");
    onSnapshot(collectionRef, (snapshot) => {
      let categories: any = [];
      snapshot.docs.forEach((doc) => {
        categories.push({ ...doc.data(), id: doc.id });
      });
      setCategories(categories as category[]);
      setIsLoading(false);
    });
  }, []);

  const onDeleteCategory = async (category: category) => {
    try {
      setIsLoading(true);
      const categoryRef = doc(db, "categories", category.id as string);
      await deleteDoc(categoryRef);
      toast.success(`Successfully deleted category`);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(`An error occurred, please try again.`);
    }
  };

  return (
    <>
      {showModal && (
        <CreateCategoryModal
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}

      {isLoading ? (
        <div className="w-full h-[30rem] flex flex-col justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex w-full  items-center justify-between">
            <h1>Manage Categories</h1>

            <button
              className="px-4 py-2 bg-[#333333] rounded-lg text-[#ffffff] min-w-max"
              onClick={() => setShowModal(!showModal)}
            >
              Add Category
            </button>
          </div>

          <div className=" flex w-[25rem] border-2 border-[#EAECF0] items-center rounded-lg gap-4 pl-4 py-2 bg-[transparent]">
            <input
              type="text"
              placeholder="Search categories...."
              className="w-full border-none bg-[transparent] outline-none"
              value={searchedCategory}
              onChange={(e) => setSearchedCategory(e.target.value)}
            />
          </div>

          <div className="flex gap-10 items-center w-full flex-wrap">
            {categories?.filter((a) =>
              a.name
                .toLowerCase()
                .includes(searchedCategory.toLocaleLowerCase())
            ).length === 0 && <p>No categories found</p>}
            <>
              {categories
                ?.filter((a) =>
                  a.name
                    .toLowerCase()
                    .includes(searchedCategory.toLocaleLowerCase())
                )
                .map((category, index) => (
                  <CategoryCard
                    category={category}
                    key={index}
                    onDeleteCategory={onDeleteCategory}
                  />
                ))}
            </>
          </div>
        </>
      )}
    </>
  );
};

export default CategoriesSection;
