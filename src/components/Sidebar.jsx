import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import AddProjectModal from "./AddProjectModal";

const Sidebar = () => {
  const [isModalOpen, setModalState] = useState(false);
  const [projects, setProjects] = useState([]);
  const location = useLocation();
  const currentPath = location.pathname;

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:9000/projects/");
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);

  // Handle project update events
  useEffect(() => {
    fetchProjects();
    const handleProjectUpdate = () => fetchProjects();
    document.addEventListener("projectUpdate", handleProjectUpdate);

    return () => {
      document.removeEventListener("projectUpdate", handleProjectUpdate);
    };
  }, [fetchProjects]);

  return (
    <div className="w-64 min-h-screen bg-white border-r shadow-md p-5">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
        <button
          onClick={() => setModalState(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition focus:ring-2 focus:ring-indigo-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Project List */}
      <ul className="space-y-2">
        {projects.map((project) => (
          <Link key={project._id} to={`/projects/${project._id}`}>
            <li
              className={`px-4 py-2 rounded-lg transition cursor-pointer font-medium text-gray-700 ${
                currentPath.includes(`/projects/${project._id}`)
                  ? "bg-indigo-100 text-indigo-600 border-l-4 border-indigo-600"
                  : "hover:bg-gray-200"
              }`}
            >
              {project.title}
            </li>
          </Link>
        ))}
      </ul>

      <AddProjectModal isModalOpen={isModalOpen} closeModal={() => setModalState(false)} />
    </div>
  );
};

export default Sidebar;
