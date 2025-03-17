import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

const roles = {
  Developer: "bg-blue-500",
  Designer: "bg-green-500",
  Manager: "bg-red-500",
  QA: "bg-yellow-500",
};

const Teams = () => {
  const [projects, setProjects] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", role: "Developer" });
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:9000/projects")
      .then((res) => {
        console.log("Fetched projects:", res.data);
        setProjects(res.data);
        if (res.data.length > 0) setSelectedProjectId(res.data[0]._id);
      })
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddMember = () => {
    if (!newMember.name || !selectedProjectId) return;

    const member = { id: uuidv4(), name: newMember.name, role: newMember.role };

    axios
      .post(`http://localhost:9000/projects/${selectedProjectId}/members`, member)
      .then(() => axios.get("http://localhost:9000/projects"))
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error adding member:", err));

    setNewMember({ name: "", role: "Developer" });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Team Management
      </motion.h1>

      {loading ? (
        <p className="text-gray-500">Loading projects...</p>
      ) : (
        <>
          {/* Input & Selection Row */}
          <motion.div
            className="flex flex-wrap gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              placeholder="Member Name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="border p-2 rounded w-[250px] focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            >
              {Object.keys(roles).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            >
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddMember}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {projects.map((project) => (
              <motion.div
                key={project._id}
                className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-xl font-bold mb-4 text-gray-700">{project.title}</h2>

                {project.members?.length > 0 ? (
                  project.members.map((member) => (
                    <motion.div
                      key={member.id}
                      className="bg-white p-3 rounded shadow flex items-center gap-3 mb-2 border border-gray-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className={`w-3 h-3 rounded-full ${roles[member.role]}`} />
                      <span className="font-semibold text-gray-800">{member.name}</span>
                      <span className="text-gray-600 text-sm">({member.role})</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No members</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Teams;
