"use client";

import React, { createContext, useEffect, useState } from "react";

export const ToastContext = createContext<any | null>(null);

export const ToastContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [message, setMessage] = useState<string>("");

  return (
    <ToastContext.Provider value={{ message }}>
      <div className="w-[30rem] border-2 border-[red]"></div>
      {children}
    </ToastContext.Provider>
  );
};
