"use client";

import { Inter } from "next/font/google";
import React, { useEffect, useState } from "react";
import { category } from "../types/types";
import CategoryCard from "../components/CategoryCard";
import { collection, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import SelectCategory from "../components/SelectCategory";
import Loader from "../components/Loader";

const Page = () => {
  const [categories, setCategories] = useState<category[]>([]);
  const [searchedCategory, setSearchedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  return (
    <>
      <div className="px-4 lg:px-20  flex flex-col gap-6">
        <h1 className={`text-[#344054] text-[2rem] `}>Available Categories</h1>
        <p className={`text-[#667085] text-[1rem] `}>
          Search from categories available
        </p>

        {isLoading ? (
          <div className="w-full h-[30rem] flex flex-col justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
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
                    <CategoryCard category={category} key={index} />
                  ))}
              </>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Page;
