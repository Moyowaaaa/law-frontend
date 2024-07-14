import React from "react";
import { TailSpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <TailSpin color="#344054" />
    </div>
  );
};

export default Loader;
