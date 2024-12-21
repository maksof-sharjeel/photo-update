
import { UploadPhoto } from "@/components/userPortal/uploadPhoto";
import React from "react";

const Page = () => {
  return (
    <div className="max-w-full">
      <h1 className="text-3xl font-semibold mb-6 text-green-700 text-center ">
        Upload Image
      </h1>
      <UploadPhoto />
    </div>
  );
};

export default Page;
