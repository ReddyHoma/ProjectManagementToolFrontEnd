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
    <div className="w-60 p-4 border-r "> {/* Ensures it starts below navbar */}
      {/* Add Project Button */}
      <div className="mb-4">
        <button
          onClick={() => setModalState(true)}
          className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
        >
          Add Project
        </button>
      </div>

      {/* Project List */}
      <ul className="space-y-2">
        {projects.map((project) => (
          <Link key={project._id} to={`/projects/${project._id}`}>
            <li
              className={`px-4 py-2 rounded-md transition ${
                currentPath === `/projects/${project._id}`
                  ? "bg-indigo-200 text-indigo-600"
                  : "hover:bg-gray-200"
              }`}
            >
              {project.title}
            </li>
          </Link>
        ))}
      </ul>

      {/* Modal Component */}
      <AddProjectModal isModalOpen={isModalOpen} closeModal={() => setModalState(false)} />
    </div>
  );
};

export default Sidebar;
