import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import EditProjectModal from "@/components/EditProjectModal";
import AddProjectModal from "@/components/AddProjectModal";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setModalState] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:9000/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const handleSaveProject = (projectData) => {
    if (projectData._id) {
      axios
        .put(`http://localhost:9000/projects/${projectData._id}`, {
          title: projectData.title,
          description: projectData.description,
        })
        .then((res) => {
          setProjects((prevProjects) =>
            prevProjects.map((proj) =>
              proj._id === projectData._id ? res.data.data : proj
            )
          );
          setIsEditModalOpen(false);
        })
        .catch((err) => console.error("Error updating project:", err));
    } else {
      axios
        .post("http://localhost:9000/projects", projectData)
        .then((res) => {
          setProjects((prevProjects) => [...prevProjects, res.data]);
          setModalState(false);
        })
        .catch((err) => console.error("Error creating project:", err));
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:9000/projects/${id}`)
      .then(() =>
        setProjects((prevProjects) => prevProjects.filter((proj) => proj._id !== id))
      )
      .catch((err) => console.error("Error deleting project:", err));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => setModalState(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="shadow-md border rounded-lg overflow-hidden">
              <div className="bg-indigo-600 h-2"></div>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold">{project.title}</h2>
                <p className="text-gray-600">{project.description}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProject(project);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(project._id)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {isEditModalOpen && (
        <EditProjectModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          project={editingProject}
          onSave={handleSaveProject}
        />
      )}

      <AddProjectModal isModalOpen={isModalOpen} closeModal={() => setModalState(false)} />
    </motion.div>
  );
}
