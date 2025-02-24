import React from "react";
import { Link} from "react-router-dom";

const Dashboard = () => {


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
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700">Active Tasks</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700">Team Members</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
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
