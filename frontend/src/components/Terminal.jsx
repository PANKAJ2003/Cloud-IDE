import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

const OPTIONS_TERM = {
  cursorBlink: true,
  fontSize: 16,
  fontFamily: "'hack', monospace",
  fontWeight: "bold",
  lineHeight: 1.2,
  theme: {
    background: "#1C2333", // Darker background
    foreground: "#d4d4d4", // Light gray text
    cursor: "#00ff00", // Green cursor
    selectionBackground: "#005f5f", // Subtle teal selection
    black: "#000000",
    red: "#f44747",
    green: "#619d4b",
    yellow: "#dcdcaa",
    blue: "#2472c8",
    magenta: "#c586c0",
    cyan: "#4ec9b0",
    white: "#d4d4d4",
    brightBlack: "#666666",
    brightRed: "#f44747",
    brightGreen: "#619d4b",
    brightYellow: "#dcdcaa",
    brightBlue: "#2472c8",
    brightMagenta: "#c586c0",
    brightCyan: "#4ec9b0",
    brightWhite: "#ffffff",
  },
};

const TerminalComponent = ({ socket }) => {
  const terminalRef = useRef(null);
  const fitAddon = useRef(new FitAddon()); // Create the fit addon instance
  const term = useRef(null); // Store terminal instance

  useEffect(() => {
    if (!terminalRef.current || !socket) {
      console.error("Terminal or socket instance is not available.");
      return;
    }

    // Initialize Terminal
    term.current = new Terminal(OPTIONS_TERM);
    term.current.loadAddon(fitAddon.current);
    term.current.open(terminalRef.current);

    // Fit terminal to container
    fitAddon.current.fit();

    // Handle server data
    const terminalHandler = ({ data }) => {
      if (data instanceof ArrayBuffer) {
        const decodedData = new TextDecoder().decode(data);
        term.current.write(decodedData);
      }
    };

    // Emit a request to initialize the terminal
    socket.emit("requestTerminal");
    socket.on("terminal", terminalHandler);

    // Send terminal input to the server
    term.current.onData((data) => {
      socket.emit("terminalData", { data });
    });

    // Resize handler
    const handleResize = () => {
      fitAddon.current.fit();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      socket.off("terminal", terminalHandler);
      window.removeEventListener("resize", handleResize);
      term.current.dispose();
    };
  }, [socket]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-gray-300 px-4 py-1 text-lg border-b border-gray-700 flex items-center justify-between">
        <span>Terminal</span>
      </div>

      {/* Terminal Container */}
      <div 
        ref={terminalRef}
        className="flex-1 bg-gray-900 border border-gray-700 rounded-md overflow-hidden shadow-lg"
      ></div>
    </div>
  );
};

export default TerminalComponent;
