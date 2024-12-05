import React, { useMemo, useEffect, useState, useCallback } from "react";
import FileTree from "./external/editor/components/FileTree";
import FileExplorer from "./external/editor/components/FileExplorer";
import { buildFileTree } from "./external/editor/utils/file-manager";
import { insertNodeTree,deleteTreeNode } from "./hooks/useTreeTraverse.jsx";

const Editor = ({ files, onSelect, selectedFile, socket }) => {
  // State Management
  const [showFileTree, setShowFileTree] = useState(true);
  const [showInput, setShowInput] = useState({
    show: false,
    type: "null",
  });

  // Memoized file tree creation
  let rootDirStruct = useMemo(() => {
    return buildFileTree(files);
  }, [files]);

  const [rootDir, setRootDir] = useState(rootDirStruct);
  const [selectedItem, setSelectedItem] = useState(null);

  // Compute current location with improved logic
  const getCurrentLocation = useCallback(() => {
    if (
      !selectedItem ||
      (selectedFile?.type === "file" && selectedItem.parentId === 0)
    ) {
      return "/";
    }

    if (selectedItem.type === "dir") {
      return `${selectedItem.path}/`;
    }

    // For files, return parent directory path
    const pathLength = selectedItem.path.length - selectedItem.name.length;
    return selectedItem.path.substring(0, pathLength);
  }, [selectedItem, selectedFile]);

  const location = getCurrentLocation();

  const createFileFolder = useCallback(
    (e) => {
      if (e.key === "Enter") {
        const name = e.target.value.trim();

        if (name) {
          const fullPath = `${location}${name}`;

          try {
            if (showInput.type === "folder") {
              socket.emit("createFolder", fullPath);
            } else if (showInput.type === "file") {
              socket.emit("createFile", fullPath);
            }
            const parentId = location === "/" ? "root/" : location;
            const updatedTree = insertNodeTree(
              rootDir,
              parentId,
              name,
              fullPath,
              showInput.type
            );
            console.log(updatedTree);
          } catch (error) {
            console.error("Error creating file/folder:", error);
          }
        }

        hideInputHandler();
      }
    },
    [location, showInput, socket]
  );

  const selectedItemHandler = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  const showInputHandler = useCallback((createType) => {
    setShowInput({
      show: true,
      type: createType,
    });
  }, []);

  const hideInputHandler = useCallback(() => {
    setShowInput({
      show: false,
      type: null,
    });
  }, []);

  const fileTreeExpandCollapse = useCallback(() => {
    setShowFileTree((prev) => !prev);
  }, []);

  const deleteItemHandler = useCallback((file) => {
    const updatedTree = deleteTreeNode(rootDir, file);
    if (updatedTree) {
      setRootDir(updatedTree);
    }
    const eventName = file.type === "file" ? "deleteFile" : "deleteFolder";
    socket.emit(eventName, file.path);
  }, [rootDir, socket]);

  // Effect to handle initial file selection
  useEffect(() => {
    if (!selectedFile && rootDir.files.length > 0) {
      onSelect(rootDir.files[0]);
    }
  }, [selectedFile, rootDir, onSelect]);

  // Update rootDir when file structure changes
  useEffect(() => {
    setRootDir(rootDirStruct);
  }, [rootDirStruct]);

  return (
    <div className="editor-container">
      <div className="flex flex-col">
        <FileExplorer
          showFileTree={fileTreeExpandCollapse}
          socket={socket}
          showInputHandler={showInputHandler}
        />
        {showFileTree && (
          <FileTree
            rootDir={rootDir}
            selectedFile={selectedFile}
            onSelect={onSelect}
            showInput={showInput}
            location={location}
            selectedItemHandler={selectedItemHandler}
            hideInputHandler={hideInputHandler}
            createFileFolder={createFileFolder}
            deleteItemHandler={deleteItemHandler}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
