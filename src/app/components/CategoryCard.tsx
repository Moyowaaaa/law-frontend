import React from "react";
import { category } from "../types/types";
import { Inter } from "next/font/google";
import rightArrow from "../../../public/images/rightArrow.png";
import Image from "next/image";

const CategoryCard = ({ category }: { category: category }) => {
  return (
    <>
      <div className="font-light lg:pr-10 rounded-lg pt-6 mt-4 flex flex-col gap-4 items-start lg:min-w-max border-none hover:border-r-2 hover:border-b-2 hover:border-[#667085] ">
        <div className="flex flex-col gap-4">
          <h1 className={` text-[1.5rem] `}>{category?.name}</h1>
          <p className={`text-[#667085] text-[1rem] `}>
            {category?.documentsCount === 0 && `No`}
            {category?.documentsCount > 0 && category?.documentsCount} Document
            {category?.documentsCount > 1 && `s`} Available.
          </p>

          <div className="flex gap-2 items-center text-[0.875rem] hover:border-b-2 hover:border-b-[#667085] w-max">
            <p>View</p>
            <Image src={rightArrow} alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryCard;
