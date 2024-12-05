import React, { useContext, useState } from "react";
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

const FileExplorer = ({ showFileTree, showInputHandler }) => {
  const [isFileTreeVisible, setIsFileTreeVisible] = useState(true);

  const toggleFileTree = () => {
    showFileTree();
    setIsFileTreeVisible((prev) => !prev);
  };

  return (
    <div className={`flex items-center h-8 text-[#C2C8CC] font-medium`}>
      {/* Toggle Icon */}
      <span
        className="m-2 text-2xl p-1 mx-1 hover:opacity-80 hover:bg-[#1C2333] rounded-md cursor-pointer"
        onClick={toggleFileTree}
      >
        {isFileTreeVisible ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />}
      </span>

      <div>Workspace</div>

      {/* Action Buttons */}
      <div className={`flex ml-auto`}>
        <span
          className="p-1 mx-1 text-lg hover:opacity-80 hover:bg-[#1C2333] rounded-md"
          onClick={() => showInputHandler("file")}
        >
          <VscNewFile />
        </span>
        <span
          className="p-1 mx-1 text-lg hover:opacity-80 hover:bg-[#1C2333] rounded-md"
          onClick={() => showInputHandler("folder")}
        >
          <VscNewFolder />
        </span>
      </div>
    </div>
  );
};

export default FileExplorer;
