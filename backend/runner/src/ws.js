
import { Server, Socket } from "socket.io";
import TerminalManager from "./pty.js";
import { saveToS3, fetchS3Folder } from "./aws.js";
import { fetchDir, fetchFileContent, saveFile, createFolder, createFile, deleteFile,deleteFolder } from "./fs.js";
import { getRunCommand } from "./runCommands.js"
const terminalManager = new TerminalManager();
const rootDir = process.env.WORKING_DIRECTORY;

export function initWs(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to Socket");

    const host = socket.handshake.headers.host;
    // const projectId = host.split(".")[0];
    const projectId = "DemoProject1"
    console.log("projectId : ", projectId);


    if (!projectId) {
      socket.disconnect();
      terminalManager.clear(socket.id);
      return;
    }

    async function loadData() {
      await fetchS3Folder(`users-code/${projectId}`, `${rootDir}`)
      const rootContent = await fetchDir(`${rootDir}`, ``)

      socket.emit("loaded", {
        rootContent: rootContent
      });
    }
    loadData();
    initHandler(socket, projectId);
  });
}

function initHandler(socket, projectId) {
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("fetchDir", async (dir, callback) => {
    const dirPath = `${rootDir}/${dir}`;
    const contents = await fetchDir(dirPath, dir);
    callback(contents);
  });

  socket.on("fetchContent", async (file, callback) => {
    const filePath = `${rootDir}/${file}`;
    const contents = await fetchFileContent(filePath);
    callback(contents);
  });

  socket.on("updateContent", async (file, content) => {
    const filePath = `${rootDir}/${file}`;
    await saveFile(filePath, content);
    await saveToS3(`users-code/${projectId}`, filePath, content);
  });

  socket.on("createFile", async (filePath) => {
    try {
      const path = `${rootDir}${filePath}`;
      await createFile(path);
    }
    catch (error) {
      console.error(error.message);
    }
  })

  socket.on("createFolder", async (dirPath) => {
    try {
      const path = `${rootDir}${dirPath}`;
      await createFolder(path);
    }
    catch (error) {
      console.error("Error in creating folder: ", error.message);
    }
  })

  socket.on("deleteFile", async (filePath) => {
    try {
      const path = `${rootDir + filePath}`
      await deleteFile(path);
    } catch (error) {
      console.log(error);
    }
  })
  socket.on("deleteFolder", async (folderPath) => {
    try {
      const path = `${rootDir+folderPath}`
      await deleteFolder(path);
    } catch (error) {
      console.log(error);
    }
  })

  socket.on("fileStructureUpdate", async (callback) => {
    try {
      const rootContent = await fetchDir(`${rootDir}`, ``)
      callback(rootContent)
    }
    catch (error) {
      console.log(error.message);

    }
  })

  socket.on("requestTerminal", async () => {
    terminalManager.createPty(socket.id, projectId, (data, id) => {
      socket.emit("terminal", {
        data: Buffer.from(data, "utf-8"),
      });
    });
  });

  socket.on("terminalData", (data) => {
    console.log("data: ", data);
    terminalManager.write(socket.id, data);
  });

  //run File
  socket.on("runFile", (filePath) => {
    const runCommand = getRunCommand(filePath)

    terminalManager.write(socket.id, { data: runCommand });
  })


}
