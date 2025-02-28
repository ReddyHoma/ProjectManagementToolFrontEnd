import { useEffect, useState } from "react";
import axios from "axios";
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

  // Fetch projects on mount
  useEffect(() => {
    axios
      .get("http://localhost:9000/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  // Handle project creation or update
  const handleSaveProject = (projectData) => {
    if (projectData._id) {
      // Update existing project
      console.log("Sending update request with:", projectData);
      axios
        .put(`http://localhost:9000/projects/${projectData._id}`, {
          title: projectData.title,
          description: projectData.description
        })
        .then((res) => {
          setProjects((prevProjects) =>
            prevProjects.map((proj) =>
              proj._id === projectData._id ? res.data.data : proj // Access nested `data`
            )
          );
          setIsEditModalOpen(false);
        })
        .catch((err) => console.error("Error updating project:", err.response?.data || err));
    }
    else {
      // Create new project
      axios
        .post("http://localhost:9000/projects", projectData)
        .then((res) => {
          setProjects((prevProjects) => [...prevProjects, res.data]);
          setIsEditModalOpen(false);
        })
        .catch((err) => console.error("Error creating project:", err));
    }
  };

  // Handle project deletion
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:9000/projects/${id}`)
      .then(() => setProjects((prevProjects) => prevProjects.filter((proj) => proj._id !== id)))
      .catch((err) => console.error("Error deleting project:", err));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => setModalState(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Card key={project._id} className="p-4 shadow-md border">
            <CardContent>
              <h2 className="text-lg font-semibold">{project.title}</h2>
              <p className="text-gray-600">{project.description}</p>
              <div className="flex gap-2 mt-3">
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
        ))}
      </div>

      {/* Edit Project Modal */}
      {isEditModalOpen && (
        <EditProjectModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          project={editingProject}
          onSave={handleSaveProject}
        />
      )}

      {/* Add Project Modal */}
      <AddProjectModal
          isModalOpen={isModalOpen}
          closeModal={() => setModalState(false)}
          //onSave={handleSaveProject}
        />
    </div>
  );
}
