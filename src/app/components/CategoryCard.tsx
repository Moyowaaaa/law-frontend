import React from "react";
import { category } from "../types/types";
import { Inter } from "next/font/google";
import rightArrow from "../../../public/images/rightArrow.png";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"], weight: "800" });
const interLight = Inter({ subsets: ["latin"], weight: "300" });

const CategoryCard = ({ category }: { category: category }) => {
  return (
    <>
      <div className=" pr-10 rounded-lg pt-6 mt-4 flex flex-col gap-4 items-start min-w-max border-none hover:border-r-2 hover:border-b-2 hover:border-[#667085] ">
        <div className="flex flex-col gap-4">
          <h1 className={`${inter.className}`}>{category?.title}</h1>
          <p className={`text-[#667085] text-[1rem] ${interLight.className}`}>
            {category?.documentCount} Document
            {category?.documentCount > 1 && `s`} Available.
          </p>

          <div className="flex gap-2 items-center text-[0.875rem]">
            <p>View</p>
            <Image src={rightArrow} alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryCard;
