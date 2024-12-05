import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { sortDir, sortFile } from "../utils/file-manager";
import { getIcon } from "./icon.jsx";
import FileFolderInput from "./FileFolderInput.jsx";
import DeleteIcon from "./DeleteIcon.jsx";

const FileTree = ({
  rootDir,
  selectedFile,
  onSelect,
  selectedItemHandler,
  showInput,
  location,
  hideInputHandler,
  createFileFolder,
  deleteItemHandler
}) => {
  return (
    <div className="h-full text-[#C2C8CC] select-none overflow-y-auto p-2">
      {showInput.show && location === "/" && (
        <FileFolderInput
          type={showInput.type}
          onBlur={hideInputHandler}
          onKeyDown={createFileFolder}
        />
      )}

      <SubTree
        directory={rootDir}
        selectedFile={selectedFile}
        onSelect={onSelect}
        depth={0}
        selectedItemHandler={selectedItemHandler}
        showInput={showInput}
        location={location}
        hideInputHandler={hideInputHandler}
        createFileFolder={createFileFolder}
        deleteItemHandler={deleteItemHandler}
      />
    </div>
  );
};

const SubTree = React.memo(
  ({
    directory,
    selectedItemHandler,
    selectedFile,
    onSelect,
    depth = 0,
    showInput,
    location,
    hideInputHandler,
    createFileFolder,
    deleteItemHandler
  }) => {
    return (
      <div className="ml-2">
        {directory.dirs.sort(sortDir).map((dir) => (
          <div key={dir.id}>
            <DirDiv
              key={dir.id}
              directory={dir}
              selectedFile={selectedFile}
              onSelect={onSelect}
              depth={depth}
              selectedItemHandler={selectedItemHandler}
              showInput={showInput}
              location={location}
              hideInputHandler={hideInputHandler}
              createFileFolder={createFileFolder}
              deleteItemHandler={deleteItemHandler}
            />
          </div>
        ))}

        {directory.files.sort(sortFile).map((file) => (
          <div key={file.id}>
            <FileDiv
              key={file.id}
              file={file}
              selectedFile={selectedFile}
              onClick={() => {
                onSelect(file);
                selectedItemHandler(file);
              }}
              depth={depth}
              deleteItemHandler={deleteItemHandler}
            />
          </div>
        ))}
      </div>
    );
  }
);
const FileDiv = ({ file, icon, selectedFile, onClick,deleteItemHandler }) => {
  const isSelected = selectedFile && selectedFile.id === file.id;
  return (
    <div
      className={`group flex items-center p-1 rounded-md transition-colors duration-200 ${
        isSelected ? "ring-2 ring-blue-700 ring-inset" : "hover:bg-[#1C2333]"
      } cursor-pointer`}
      onClick={onClick}
    >
      <FileIcon name={icon} extension={file.name.split(".").pop() || ""} />
      <span className="ml-2 text-truncate">{file.name}</span>
      <div className="ml-auto mr-3 p-1 rounded hover:opacity-70 hidden group-hover:block"
      onClick={(e)=>{
        e.stopPropagation();
        deleteItemHandler(file);
      }}>
        <DeleteIcon />
      </div>
    </div>
  );
};


const DirDiv = ({
  directory,
  selectedFile,
  onSelect,
  depth = 0,
  selectedItemHandler,
  showInput,
  location,
  hideInputHandler,
  createFileFolder,
  deleteItemHandler
}) => {
  let defaultOpen = false;
  if (selectedFile) defaultOpen = isChildSelected(directory, selectedFile);
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <FileDiv
        file={directory}
        icon={open ? "openDirectory" : "closedDirectory"}
        selectedFile={selectedFile}
        depth={depth}
        onClick={() => {
          setOpen(!open);
          onSelect(directory);
          selectedItemHandler(directory);
        }}
        deleteItemHandler={deleteItemHandler}
      />
      {open && (
        <div>
          {showInput.show && location === `${directory.path}/` && (
            <FileFolderInput
              type={showInput.type}
              onBlur={hideInputHandler}
              onKeyDown={createFileFolder}
            />
          )}
          <SubTree
            directory={directory}
            selectedFile={selectedFile}
            onSelect={onSelect}
            depth={depth + 1}
            selectedItemHandler={selectedItemHandler}
            showInput={showInput}
            location={location}
            hideInputHandler={hideInputHandler}
            createFileFolder={createFileFolder}
            deleteItemHandler={deleteItemHandler}
          />
        </div>
      )}
    </>
  );
};

const isChildSelected = (directory, selectedFile) => {
  let res = false;

  function isChild(dir) {
    if (selectedFile.parentId === dir.id) {
      res = true;
      return;
    }
    dir.dirs.forEach((item) => isChild(item));
  }

  isChild(directory);
  return res;
};

const FileIcon = ({ extension, name }) => {
  const icon = getIcon(extension || "", name || "");
  return (
    <span className="flex w-6 h-6 justify-center items-center text-gray-400">
      {icon}
    </span>
  );
};

FileTree.propTypes = {
  rootDir: PropTypes.shape({
    dirs: PropTypes.arrayOf(PropTypes.object),
    files: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  selectedFile: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
};

export default FileTree;
