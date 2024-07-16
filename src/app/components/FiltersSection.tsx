import React, { SetStateAction, useMemo, useState } from "react";
import downArrow from "../../../public/images/downArrow.svg";
import upArrow from "../../../public/images/upArrow.svg";
import Image from "next/image";
import { category } from "../types/types";
import { sentenceCase } from "../../../utils";
import { statesInNigeria } from "./UploadModal";

const FiltersSection = ({
  categories,
  selectedCategories,
  setSelectedCategories,
}: {
  categories: category[];
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<SetStateAction<string[]>>;
}) => {
  const [showCategoryFilters, setShowCategoryFilters] = useState<boolean>(true);
  const [showStateFilters, setShowStateFilters] = useState<boolean>(false);

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategories((prevSelectedCategories) => {
      const newSelectedCategories = prevSelectedCategories.includes(
        categoryName.toLowerCase()
      )
        ? prevSelectedCategories.filter(
            (cat) => cat !== categoryName.toLowerCase()
          )
        : [...prevSelectedCategories, categoryName.toLowerCase()];

      const urlParams = new URLSearchParams(window.location.search);
      console.log({ urlParams });
      urlParams.set("categories", newSelectedCategories.join(","));
      window.history.replaceState(null, "", `?${urlParams.toString()}`);

      return newSelectedCategories;
    });
  };

  return (
    <>
      <div className="self-start flex flex-col gap-4 w-10/12">
        <div className="mt-8 flex w-full border-2 border-[#EAECF0] items-center rounded-lg gap-4 pl-4 py-2 bg-[transparent]">
          <p>Sort by</p>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="flex gap-2 items-center justify-between"
            onClick={() => setShowCategoryFilters(!showCategoryFilters)}
          >
            <p className={` text-[#101828]`}>Categories</p>
            <Image src={showCategoryFilters ? upArrow : downArrow} alt="" />
          </div>

          {showCategoryFilters && (
            <>
              {categories.length === 0 ? (
                <p>No categories available</p>
              ) : (
                <div className="max-h-[15rem] overflow-y-auto flex gap-2 flex-col">
                  {categories?.map((c, index) => (
                    <div className="flex items-center gap-4" key={index}>
                      <input
                        type="checkbox"
                        className="form-checkbox h-6 w-6 text-blue-600"
                        checked={selectedCategories.includes(
                          c.name.toLowerCase()
                        )}
                        onChange={() => handleCategoryChange(c.name)}
                      />
                      <p>{sentenceCase(c.name)}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* <div className="flex flex-col gap-4">
          <div
            className="flex gap-2 items-center justify-between"
            onClick={() => setShowStateFilters(!showStateFilters)}
          >
            <p className={` text-[#101828]`}>States</p>
            <Image src={showStateFilters ? upArrow : downArrow} alt="" />
          </div>

          {showStateFilters && (
            <div className="max-h-[15rem] overflow-y-auto flex gap-2 flex-col">
              {statesInNigeria?.map((c, index) => (
                <div className="flex items-center gap-4" key={index}>
                  <input
                    type="checkbox"
                    className="form-checkbox h-6 w-6 text-blue-600"
                  />
                  <p>{c}</p>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </>
  );
};

export default FiltersSection;
