
import { readdir, readFile, writeFile, mkdir, rm } from "fs/promises";


export async function fetchFileContent(file) {
    if (typeof file !== "string") {
        console.error("Invalid file parameter:", file);
        return { success: false, error: "Invalid file parameter" };
    }

    try {
        const contents = await readFile(file, { encoding: "utf8" });
        return { success: true, data: contents };
    } catch (err) {
        console.error("Error reading file:", err.message);
        return { success: false, error: err.message };
    }
}


export async function fetchDir(dir, baseDir) {
    try {

        const files = await readdir(dir, { withFileTypes: true });
        return files.map(file => ({
            type: file.isDirectory() ? "dir" : "file",
            name: file.name,
            path: `${baseDir}/${file.name}`,
        }));
    } catch (err) {
        throw new Error(`Failed to read directory: ${err.message}`);
    }
}

export async function saveFile(file, content) {
    try {
        await writeFile(file, content, { encoding: "utf8" });
    } catch (err) {
        throw new Error(`Failed to save file: ${err.message}`);
    }
}

export async function createFolder(dirPath) {
    try {
        await mkdir(dirPath)
    }
    catch (error) {
        throw new Error(`Failed to create folder: ${error.message}`)
    }
}

export async function createFile(filePath) {
    try {
        await writeFile(filePath, "", { encoding: "utf8" });
    }
    catch (error) {
        throw new Error(`Failed to create new file: ${error.message}`);
    }
}


export async function deleteFile(filePath) {
    try {
        await rm(filePath);
        console.log(`File at ${filePath} deleted successfully.`);
    } catch (error) {
        throw new Error(`Error in deleting file: ${error.message}`);
    }
}

export async function deleteFolder(folderPath) {
    try {
        await rm(folderPath, { recursive: true, force: true });
        console.log(`Folder at ${folderPath} deleted successfully.`);
    } catch (error) {
        throw new Error(`Error in deleting folder: ${error.message}`);
    }
}


