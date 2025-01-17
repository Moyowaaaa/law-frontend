"use client";

import { Inter } from "next/font/google";
import React, { useContext, useEffect, useState } from "react";
import searchIcon from "../../../public/images/search.svg";
import Image from "next/image";
import FiltersSection from "../components/FiltersSection";
import DocumentsSection from "../components/DocumentsSection";
import { collection, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { AuthContext } from "@/context/AuthContext";
import { category } from "../types/types";

const Page = () => {
  const { currentUser } = useContext(AuthContext);
  const [categories, setCategories] = useState<category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const collectionRef = collection(db, "categories");
    orderBy("createdAt");
    onSnapshot(collectionRef, (snapshot) => {
      let categories: any = [];
      snapshot.docs.forEach((doc) => {
        categories.push({ ...doc.data(), id: doc.id });
      });
      setCategories(categories as category[]);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("categories");

    if (categoryParam) {
      setSelectedCategories(categoryParam.split(","));
    }
  }, []);

  return (
    <>
      <div className="px-4 lg:px-20 flex flex-col gap-4">
        <div className="w-full lg:w-max flex flex-col gap-4">
          <h1 className={`text-[#344054] text-[2rem] `}>
            Over 2000+ Nigerian Law Drafts Available
          </h1>
          <p className={`text-[#667085] text-[1rem] `}>
            No more stressful search.
          </p>
          <div className="mt-8 flex w-full border-2 border-[#EAECF0] items-center rounded-lg gap-4 lg:pl-4 py-2 bg-[transparent]">
            <div className="min-w-max">
              <Image src={searchIcon} alt="" />
            </div>
            <input
              type="text"
              placeholder="Search for draft"
              className="w-full border-none bg-[transparent] outline-none"
            />
          </div>
        </div>

        <div className="w-full h-max flex justify-center py-8 gap-2 lg:gap-10">
          <div className="hidden lg:flex w-3/12 pt-8">
            <FiltersSection
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
          <div className="border-r-2 border-[#EAECF0] h-[auto] rotate-180"></div>
          <div className="w-full lg:w-9/12 flex flex-col gap-2">
            <DocumentsSection selectedCategories={selectedCategories} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
