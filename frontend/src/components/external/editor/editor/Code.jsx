import React, { useEffect, useMemo, useRef } from "react";
import Editor from "@monaco-editor/react";

export const Code = ({ selectedFile, socket }) => {
  const editorRef = useRef(null);

  // Only render if selectedFile is available
  if (!selectedFile) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-500">
        No file selected
      </div>
    );
  }

  const code = useMemo(() => selectedFile.content.data, [selectedFile]);
  const language = useMemo(() => {
    const extension = selectedFile.name.split(".").pop();
    const langMap = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      c: "c",
      cpp: "cpp",
      css: "css",
      html: "html",
      json: "json",
      md: "markdown",
    };
    return langMap[extension] || "plaintext";
  }, [selectedFile]);

  // Debounced onChange handler
  const debounce = (func, wait) => {
    let timeout;
    return (value) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(value);
      }, wait);
    };
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Define custom theme when the editor mounts
    monaco.editor.defineTheme("custom-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "888888" },
        { token: "keyword", foreground: "FF5733" },
        { token: "variable", foreground: "4CAF50" },
      ],
      colors: {
        "editor.background": "#1C2333",
        "editor.foreground": "#D4D4D4",
        "editorCursor.foreground": "#FFFFFF",
      },
    });
    
    // Set the theme after defining it
    monaco.editor.setTheme("custom-theme");
  };

  return (
    <div className="h-full bg-gray-900">
      <div className="dark:bg-gray-800 text-white px-4 py-2 text-sm border-b border-gray-700 flex items-center justify-between">
        <span>{selectedFile.name}</span>
        <span className="text-gray-400 uppercase">{language}</span>
      </div>
      <Editor
        height="100%"
        language={language}
        value={code}
        theme="custom-theme"
        onChange={debounce((value) => {
          socket.emit("updateContent", selectedFile.path, value);
        }, 500)}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          lineNumbers: "on",
          fontSize: 18,
          wordWrap: "on",
          wrappingIndent: "same",
          scrollbar: {
            vertical: "hidden",  // Hide vertical scrollbar
            horizontal: "hidden", // Hide horizontal scrollbar
          },
          fontFamily: "'hack', 'Consolas', 'monospace'",
        }}
      />
    </div>
  );
};

export default Code;