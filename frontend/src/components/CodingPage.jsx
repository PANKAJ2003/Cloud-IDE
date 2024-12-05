import React, { useEffect, useState } from "react";
import {io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import Editor from "./Editor";
import Terminal from "./Terminal";
import Code from "./external/editor/editor/Code.jsx";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TopBar } from "./TopBar.jsx";

function useSocket(projectId) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`ws://localhost:9000`);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [projectId]);

  return socket;
}


const CodingPage = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const socket = useSocket(projectId);
  const [loaded, setLoaded] = useState(false);
  const [fileStructure, setFileStructure] = useState([]);
  const [selectedFile, setSelectedFile] = useState(undefined);

  useEffect(() => {
    if (socket) {
      socket.on("loaded", ({ rootContent }) => {
        setLoaded(true);
        setFileStructure(rootContent);
      });
    }
  }, [socket]);

  const onSelect = (file) => {
    
    if (file.type === "dir") {
      socket.emit("fetchDir", file.path, (data) => {
        setFileStructure((prev) => {
          const allFiles = [...prev, ...data];
          return allFiles.filter(
            (file, index, self) =>
              index === self.findIndex((f) => f.path === file.path)
          );
        });
      });
    } else {
      socket.emit("fetchContent", file.path, (data) => {
        file.content = data;
        setSelectedFile(file);
      });
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }
  
  return (
    <div className="bg-[#0E1525]">
      <TopBar
        projectID={projectId}
        socket={socket}
        selectedFile={selectedFile}
      />
      <PanelGroup direction="horizontal" className="h-screen font-IBMPlexSans">
        {/* File Explorer Panel */}
        <Panel defaultSize={12} minSize={8} className="bg-[#0E1525] rounded">
          <Editor
            files={fileStructure}
            socket={socket}
            selectedFile={selectedFile}
            onSelect={onSelect}
          />
        </Panel>

        <PanelResizeHandle />

        {/* Code Editor Panel */}
        <Panel
          defaultSize={50}
          className="h-screen rounded"
          onResize={() => {
            if (selectedFile) {
              const editorComponent = document.querySelector(".monaco-editor");
              if (editorComponent) {
                const resizeEvent = new Event("resize");
                editorComponent.dispatchEvent(resizeEvent);
              }
            }
          }}
        >
          {selectedFile && <Code selectedFile={selectedFile} socket={socket} />}
        </Panel>

        <PanelResizeHandle />

        {/* Terminal Panel */}
        <Panel
          defaultSize={25}
          className="h-screen rounded"
          onResize={() => {
            const terminalElement = document.querySelector(".xterm");
            if (terminalElement) {
              const resizeEvent = new Event("resize");
              terminalElement.dispatchEvent(resizeEvent);
            }
          }}
        >
          <Terminal socket={socket} />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default CodingPage;
