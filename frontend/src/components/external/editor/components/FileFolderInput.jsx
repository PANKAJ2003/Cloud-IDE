import React from "react";
import { FaFolder, FaFile } from "react-icons/fa";
const FileFolderInput = ({ type, onBlur, onKeyDown }) => {
  return (
    <div className="flex items-center ml-3">
      <span className="">{type === "file" ? <FaFile /> : <FaFolder />}</span>
      <input
        className="ml-3 p-1 rounded-md border border-gray-300  bg-[#1C2333] h-7  w-full"
        type="text"
        autoFocus
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default FileFolderInput;
