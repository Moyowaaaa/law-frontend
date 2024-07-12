"use client";

import { Inter } from "next/font/google";
import React, { useEffect, useState } from "react";
import { category } from "../types/types";
import CategoryCard from "../components/CategoryCard";
import { collection, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import SelectCategory from "../components/SelectCategory";

const inter = Inter({ subsets: ["latin"], weight: "800" });
const interLight = Inter({ subsets: ["latin"], weight: "300" });

// export const categories: category[] = [
//   { title: "Charge and bail", documentCount: 90 },
//   { title: "Civil Litigation", documentCount: 90 },
//   { title: "Agreement", documentCount: 90 },
//   { title: "Land Use", documentCount: 90 },
//   { title: "Charge and bail", documentCount: 90 },
//   { title: "Charge and bail", documentCount: 90 },
//   { title: "Charge and bail", documentCount: 90 },
// ];

const Page = () => {
  const [categories, setCategories] = useState<category[]>([]);

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
  }, []);

  return (
    <>
      <div className="px-4 lg:px-20  flex flex-col gap-6">
        <h1 className={`text-[#344054] text-[2rem] ${inter.className}`}>
          Available Categories
        </h1>
        <p className={`text-[#667085] text-[1rem] ${interLight.className}`}>
          Search from categories available
        </p>

        <SelectCategory />

        <div className="flex gap-6 items-center w-full flex-wrap">
          {categories?.map((category, index) => (
            <CategoryCard category={category} key={index} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
