import React from "react";
import downArrow from "../../../public/images/downArrow.svg";
import upArrow from "../../../public/images/upArrow.svg";
import Image from "next/image";
import { Inter } from "next/font/google";
import { categories } from "../categories/page";

const interSemi = Inter({ subsets: ["latin"], weight: "500" });
const FiltersSection = () => {
  return (
    <>
      <div className="self-start flex flex-col gap-4 w-10/12">
        <div className="mt-8 flex w-full border-2 border-[#EAECF0] items-center rounded-lg gap-4 pl-4 py-2 bg-[transparent]">
          <p>Sort by</p>
        </div>

        <div className="flex gap-2 items-center justify-between">
          <p className={`${interSemi.className} text-[#101828]`}>Categories</p>
          <Image src={upArrow} alt="" />
        </div>

        {categories?.map((c, index) => (
          <div className="flex items-center gap-4" key={index}>
            <input
              type="checkbox"
              className="form-checkbox h-6 w-6 text-blue-600"
            />
            <p>{c.title}</p>
          </div>
        ))}

        <div className="flex gap-2 items-center justify-between">
          <p className={`${interSemi.className} text-[#101828]`}>States</p>
          <Image src={downArrow} alt="" />
        </div>

        <div className="flex gap-2 items-center justify-between">
          <p className={`${interSemi.className} text-[#101828]`}>
            Another Category
          </p>
          <Image src={downArrow} alt="" />
        </div>
      </div>
    </>
  );
};

export default FiltersSection;
