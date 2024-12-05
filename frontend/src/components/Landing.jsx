import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Rocket, Code, ChevronRight } from "lucide-react";

const SERVICE_URL = "http://localhost:3001";

const Landing = () => {
  const [projectId, setProjectId] = useState("");
  const [language, setLanguage] = useState("node");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initCodingEnv = async () => {
    if (!projectId.trim()) {
      alert("Please enter a project title");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${SERVICE_URL}/project`, {
        projectId,
        language,
      });
      navigate(`/coding/?projectId=${projectId}`);
    } catch (error) {
      console.error("Error in creating project:", error);
      alert("Failed to start coding session. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6 flex items-center">
          <Rocket className="mr-3" size={40} />
          <h1 className="text-3xl font-bold">Create Your Project</h1>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label 
              htmlFor="projectId" 
              className="block text-lg font-medium text-gray-700 mb-3"
            >
              Project Title
            </label>
            <input
              id="projectId"
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Enter a descriptive project name"
              className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>

          <div>
            <label 
              htmlFor="language" 
              className="block text-lg font-medium text-gray-700 mb-3"
            >
              Programming Language
            </label>
            <div className="relative">
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                <option value="node">Node.js</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronRight size={24} />
              </div>
            </div>
          </div>

          <button
            onClick={initCodingEnv}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-4 text-base bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 disabled:opacity-50"
          >
            <Code className="mr-3" size={24} />
            {loading ? "Starting Project..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;