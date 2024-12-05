import React, { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";

const FlowChart = ({show}) => {
  const [query, setQuery] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const generateFlowchartHandler = async () => {
    const userQuery = query.trim();
    if (userQuery !== "") {
      setLoading(true);
      setError(""); 
      setImgUrl("");
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const data = await response.json();

        if (response.ok) {
          setImgUrl(data.img_url);
        } else {
          setError(data.error || "Failed to generate flowchart.");
        }
      } catch (error) {
        setError("Something went wrong. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Input cannot be empty");
    }
  };

  return (
    <div
      className="fixed bg-[#0E1525] text-[#C2C8CC] min-w-[80%] md:min-w-[800px] min-h-48 mt-64 z-50 p-4 shadow-lg rounded-md overflow-auto h-auto w-auto "
      style={{
        top: "20%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="flex">

      <div className="font-IBMPlexSans text-lg mb-4">Flowchart</div>
      <span className="ml-auto mr-1 text-xl text-red-800 hover:text-red-600"
      onClick={show}><MdOutlineCancel/></span>
      </div>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter your query"
          className="p-2 w-full rounded-md border border-gray-300  bg-[#1C2333]"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError("");
          }}
          aria-label="Flowchart Query Input"
        />
        <button
          className="bg-blue-500 px-7 py-2 rounded-md hover:bg-blue-700 font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={generateFlowchartHandler}
          disabled={loading}
          aria-label="Generate Flowchart Button"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      <div className="mt-4">
        {error && <p className="text-red-600">{error}</p>}
        {loading && <div className="text-gray-700">Generating Flowchart...</div>}
        {imgUrl ? (
          <div className="mt-4">
            <div className="text-gray-700 mb-2">Generated Flowchart:</div>
            <div className="flowchart max-w-full max-h-[400px] overflow-auto flex justify-center">
              <img
                src={imgUrl}
                alt="Generated Flowchart"
                className="object-scale-down cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          </div>
        ) : (
          !loading && <p className="text-gray-600">Your generated flowchart will appear here.</p>
        )}
      </div>

      {/* Modal for Zoom */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={imgUrl}
            alt="Zoomed Flowchart"
            className="w-[100%] max-h-[100%] object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default FlowChart;
