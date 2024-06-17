import { Inter } from "next/font/google";
import React from "react";
import { category } from "../types/types";
import CategoryCard from "../components/CategoryCard";

const inter = Inter({ subsets: ["latin"], weight: "800" });
const interLight = Inter({ subsets: ["latin"], weight: "300" });

const Page = () => {
  const categories: category[] = [
    { title: "Charge and bail", documentCount: 90 },
    { title: "Civil Litigation", documentCount: 90 },
    { title: "Agreement", documentCount: 90 },
    { title: "Land Use", documentCount: 90 },
    { title: "Charge and bail", documentCount: 90 },
    { title: "Charge and bail", documentCount: 90 },
    { title: "Charge and bail", documentCount: 90 },
  ];

  return (
    <>
      <div className="px-20  flex flex-col gap-6">
        <h1 className={`text-[#344054] text-[2rem] ${inter.className}`}>
          Available Categories
        </h1>
        <p className={`text-[#667085] text-[1rem] ${interLight.className}`}>
          Search from categories available
        </p>

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
