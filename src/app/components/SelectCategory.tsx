"use client";

import { db } from "@/firebase/firebaseConfig";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import React, { SetStateAction, useEffect, useMemo, useState } from "react";
import { category } from "../types/types";

const SelectCategory = ({
  setCategory,
}: {
  setCategory: React.Dispatch<SetStateAction<string>>;
}) => {
  const [categories, setCategories] = useState<category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showOptions, setShowOptions] = useState<boolean>(false);

  useEffect(() => {
    const collectionRef = collection(db, "categories");
    orderBy("createdAt");
    onSnapshot(collectionRef, (snapshot) => {
      let documents: any = [];
      snapshot.docs.forEach((doc) => {
        documents.push({ ...doc.data(), id: doc.id });
      });
      setCategories(documents as category[]);
    });
  }, []);

  const filteredCategory = useMemo(() => {
    if (newCategory && newCategory.length > 3) {
      setShowOptions(true);
      return categories.filter((c) =>
        c.name.toLowerCase().includes(newCategory.toLowerCase())
      );
    }

    return categories || [];
  }, [newCategory, categories]);

  const onSelectCategory = async (category: string) => {
    try {
      const existingCategory = categories.find((c) => c.name === category);
      if (!existingCategory) {
        const newCategoryDocRef = await addDoc(collection(db, "categories"), {
          name: category,
          createdAt: serverTimestamp(),
        });
        setCategory(category);
        setNewCategory(category);
      } else {
        setCategory(category);
        setNewCategory(category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 w-[18rem]">
        <p>Category</p>
        <div className=" flex w-full border-2 border-[#EAECF0] items-center rounded-lg gap-4 pl-4 py-2 bg-[transparent]">
          <input
            type="text"
            placeholder=""
            className="w-full border-none bg-[transparent] outline-none"
            onFocus={() => setShowOptions(true)}
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </div>

        {newCategory.length > 3 && showOptions && (
          <div className="w-full max-h-[10rem] overflow-y-auto bg-[#efefef] rounded-lg">
            {filteredCategory.length > 0 ? (
              <div className="flex flex-col gap-2 items-start">
                {filteredCategory.map((c, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectCategory(c.name)}
                    className="hover:bg-[#344054] hover:text-[white] rounded-md w-full text-left p-2"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            ) : (
              <button
                className="px-2 py-4 w-full"
                onClick={() => onSelectCategory(newCategory)}
              >
                <p>{newCategory}</p>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SelectCategory;
