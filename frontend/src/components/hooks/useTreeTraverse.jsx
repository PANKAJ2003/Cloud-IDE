export const insertNodeTree = (tree, parentId, itemName, path, type) => {
  if (`${tree.id}/` === parentId) {
    const newNode = {
      id: path,
      name: itemName,
      parentId: parentId,
      type: type,
      path: path,
      depth: tree.depth + 1,
      dirs: [],
      files: [],
    };

    if (type === "files") {
      tree.files.push(newNode);
    } else {
      tree.dirs.push(newNode);
    }

    return tree;
  }

  // Traverse subdirectories
  for (const dir of tree.dirs) {
    const updatedTree = insertNodeTree(dir, parentId, itemName, path, type);
    if (updatedTree) {
      return tree;
    }
  }

  return null;
};

export const deleteTreeNode = (tree, file) => {
  if(!tree)return null;

  const fileIndex = tree.files.findIndex((f) => f.id === file.id);
  
  if (fileIndex !== -1) {
    
    tree.files.splice(fileIndex, 1);
    return tree;
  }

  const dirIndex = tree.dirs.findIndex((dir) => dir.id === file.id);
  if (dirIndex !== -1) {
    tree.dirs.splice(dirIndex, 1);
    return tree;
  }

  //check in sub directories
  for (const dir of tree.dirs) {
    const updatedTree = deleteTreeNode(dir, file);
    if (updatedTree) {
      return tree; 
    }
  }

  return null;
};

