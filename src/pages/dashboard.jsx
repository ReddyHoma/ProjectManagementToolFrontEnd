import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:9000/projects")
      .then((res) => {
        setProjects(res.data);
        setProjectCount(res.data.length);
        const totalTasks = res.data.reduce((count, project) => count + (project.task?.length || 0), 0);
        setTaskCount(totalTasks);
        const totalMembers = res.data.reduce((count, project) => count + (project.members?.length || 0), 0);
        setMemberCount(totalMembers);
        if (res.data.length > 0) setSelectedProjectId(res.data[0]._id);
      })
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:9000/activities")
      .then((res) => {
        setRecentActivities(res.data);
      })
      .catch((err) => console.error("Error fetching activities:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <Link to="/projects" className="no-underline bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700 transition-all">
            View Projects
          </Link>
          <Link to="/tasks" className="no-underline bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700 transition-all ml-2">
            View Tasks
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {[{
          label: "Total Projects",
          value: projectCount,
          color: "bg-indigo-600",
          textColor: "text-indigo-600"
        }, {
          label: "Active Tasks",
          value: taskCount,
          color: "bg-green-600",
          textColor: "text-green-600"
        }, {
          label: "Team Members",
          value: memberCount,
          color: "bg-blue-600",
          textColor: "text-blue-600"
        }].map((stat, index) => (
          <motion.div 
            key={index} 
            className="bg-white shadow rounded-lg overflow-hidden" 
            whileHover={{ scale: 1.05 }}
          >
            <div className={`${stat.color} h-2 w-full`}></div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-700">{stat.label}</h3>
              <motion.p 
                className={`text-3xl font-bold ${stat.textColor}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {stat.value}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="bg-white shadow p-6 rounded-lg" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <ul className="space-y-3 bg-white p-4 rounded-lg shadow">
          {recentActivities.length > 0 ? (
            [...recentActivities]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(0, 3)
              .map((activity, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 odd:bg-gray-50 even:bg-white transition duration-300 hover:bg-gray-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.2 }}
                >
                  <span className="text-blue-500">📌</span>
                  <p className="text-sm text-gray-700">{activity.message}</p>
                </motion.li>
              ))
          ) : (
            <motion.p 
              className="text-gray-400 text-center p-3 bg-gray-100 rounded-lg" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.3 }}
            >
              No recent activities yet.
            </motion.p>
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;