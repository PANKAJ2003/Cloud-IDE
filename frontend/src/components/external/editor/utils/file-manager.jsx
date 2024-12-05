const Type = {
  FILE: "file",
  DIRECTORY: "dir",
};

function buildFileTree(data) {
  const dirs = data.filter((x) => x.type === Type.DIRECTORY);
  const files = data.filter((x) => x.type === Type.FILE);
  const cache = new Map();

  let rootDir = {
    id: "root",
    name: "root",
    parentId: undefined,
    type: Type.DIRECTORY,
    path: "",
    depth: 0,
    dirs: [],
    files: [],
  };

  dirs.forEach((item) => {
    const parentPath = item.path.split("/").slice(0, -1).join("/"); // Extract the parent path
    const isRootDir = item.path.split("/").length === 2; // Check if this is a root directory
    const parentDir = dirs.find((x) => x.path === parentPath); // Find the parent directory

    // Construct the directory object
    const dir = {
      id: item.path,
      name: item.name,
      path: item.path,
      parentId: isRootDir ? "0" : parentDir?.path || null, // Set parentId based on conditions
      type: Type.DIRECTORY,
      depth: 0,
      dirs: [],
      files: [],
    };

    // Cache the directory
    cache.set(dir.id, dir);
  });

  files.forEach((item) => {
    const parentPath = item.path.split("/").slice(0, -1).join("/");
    const file = {
      id: item.path,
      name: item.name,
      path: item.path,
      parentId:
        item.path.split("/").length === 2
          ? "0"
          : dirs.find((x) => x.path === parentPath)?.path || null,
      type: Type.FILE,
      depth: 0,
    };
    cache.set(file.id, file);
  });

  cache.forEach((value) => {
    if (value.parentId === "0") {
      if (value.type === Type.DIRECTORY) rootDir.dirs.push(value);
      else rootDir.files.push(value);
    } else {
      const parentDir = cache.get(value.parentId);
      if (parentDir) {
        if (value.type === Type.DIRECTORY) parentDir.dirs.push(value);
        else parentDir.files.push(value);
      }
    }
  });

  // Calculate depth recursively
  getDepth(rootDir, 0);
  return rootDir;
}

function getDepth(rootDir, currDepth) {
  rootDir.files.forEach((file) => {
    file.depth = currDepth + 1;
  });
  rootDir.dirs.forEach((dir) => {
    dir.depth = currDepth + 1;
    getDepth(dir, currDepth + 1);
  });
}

function findFileByName(rootDir, fileName) {
  let targetFile = undefined;

  function findFile(dir, fileName) {
    dir.files.forEach((file) => {
      if (file.name === fileName) {
        targetFile = file;
        return;
      }
    });
    dir.dirs.forEach((subDir) => {
      findFile(subDir, fileName);
    });
  }
  findFile(rootDir, fileName);
  return targetFile;
}

function sortDir(l, r) {
  return l.name.localeCompare(r.name);
}

function sortFile(l, r) {
  return l.name.localeCompare(r.name);
}

export { buildFileTree, sortDir, sortFile, findFileByName };
