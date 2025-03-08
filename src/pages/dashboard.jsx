import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {

  const [projectCount, setProjectCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:9000/projects")
      .then((res) => {
        console.log("Fetched projects:", res.data);
        setProjects(res.data);
        setProjectCount(res.data.length); // Store count of projects
        res.data.forEach(project => console.log(`Project: ${project.title}, Tasks:`, project.task));
        const totalTasks = res.data.reduce((count, project) => count + (project.task?.length || 0), 0);
        setTaskCount(totalTasks);
        const totalMembers = res.data.reduce((count, project) => count + (project.members?.length || 0), 0);
        setMemberCount(totalMembers);
        if (res.data.length > 0) setSelectedProjectId(res.data[0]._id);
      })
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <Link to="/projects" className="no-underline bg-indigo-600 text-white px-4 py-2 rounded-md mr-2">
            View Projects
          </Link>
          <Link to="/tasks" className="no-underline bg-gray-600 text-white px-4 py-2 rounded-md">
            View Tasks
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700">Total Projects</h3>
          <p className="text-3xl font-bold text-indigo-600">{projectCount}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700">Active Tasks</h3>
          <p className="text-3xl font-bold text-green-600">{taskCount}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700">Team Members</h3>
          <p className="text-3xl font-bold text-blue-600">{memberCount}</p>
        </div>
      </div>

      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <ul className="space-y-3">
          <li className="text-gray-600"> <strong>Owner</strong> started a new project: <span className="text-indigo-600">Project Management Tool - Phase 1 - Frontend</span></li>
          <li className="text-gray-600"> <strong>Owner</strong> completed the task: <span className="text-green-600">Dashboard Design</span></li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
