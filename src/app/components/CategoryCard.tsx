import React from "react";
import { category } from "../types/types";
import rightArrow from "../../../public/images/rightArrow.png";
import Image from "next/image";
import { sentenceCase } from "../../../utils";
import { usePathname, useRouter } from "next/navigation";

const CategoryCard = ({
  category,
  onDeleteCategory,
}: {
  category: category;
  onDeleteCategory?: (category: category) => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleViewClick = () => {
    // Constructing the URL manually with query parameters
    const url = `/dashboard?category=${encodeURIComponent(category.name)}`;
    router.push(url);
  };

  return (
    <div className="font-light lg:pr-16   pt-6 pb-4 mt-4 flex flex-col gap-4 items-start lg:min-w-[15rem]   pl-4">
      <div className="flex flex-col gap-4">
        <h1 className={` text-[1.5rem] `}>{sentenceCase(category?.name)}</h1>
        <p className={`text-[#667085] text-[1rem] `}>
          {category?.documentsCount === 0 && `No`}
          {category?.documentsCount > 0 && category?.documentsCount} Document
          {category?.documentsCount > 1 && `s`} Available.
        </p>

        <div className="w-full flex items-center justify-between min-w-[12rem]">
          <div
            className="flex gap-2 items-center text-[0.875rem] hover:border-b-2 hover:border-b-[#667085] w-max"
            onClick={handleViewClick}
          >
            <p>View</p>
            <Image src={rightArrow} alt="" />
          </div>

          {pathname === "/admin" && (
            <button
              onClick={() => {
                if (onDeleteCategory) {
                  onDeleteCategory(category);
                }
              }}
              className="py-2 px-4 text-[red] font-bold"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
