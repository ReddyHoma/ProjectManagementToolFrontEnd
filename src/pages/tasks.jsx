import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddTaskModal from "../components/AddTaskModal";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState({ requested: [], todo: [], inProgress: [], completed: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:9000/projects")
      .then((res) => {
        setProjects(res.data);
        if (res.data.length > 0) {
          setSelectedProjectId(res.data[0]._id);
        }
      })
      .catch((err) => setError("Error fetching projects."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    axios.get(`http://localhost:9000/projects/${selectedProjectId}/tasks`)
      .then((res) => {
        setTasks({
          requested: res.data.requested || [],
          todo: res.data.todo || [],
          inProgress: res.data.inProgress || [],
          completed: res.data.completed || [],
        });
      })
      .catch((err) => setError("Error fetching tasks."));
  }, [selectedProjectId]);

  const addTask = (newTask) => {
    axios.post(`http://localhost:9000/projects/${selectedProjectId}/tasks`, newTask)
      .then(() => axios.get(`http://localhost:9000/projects/${selectedProjectId}/tasks`))
      .then((res) => setTasks({
        requested: res.data.requested || [],
        todo: res.data.todo || [],
        inProgress: res.data.inProgress || [],
        completed: res.data.completed || [],
      }))
      .catch(() => setError("Error adding task."));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    const movedTask = tasks[sourceCol][source.index];
    if (!movedTask) return;

    const newStage = {
      requested: "Requested",
      todo: "To Do",
      inProgress: "In Progress",
      completed: "Completed",
    }[destCol];

    axios.put(`http://localhost:9000/projects/${selectedProjectId}/tasks/${movedTask._id}`, { stage: newStage })
      .then(() => axios.get(`http://localhost:9000/projects/${selectedProjectId}/tasks`))
      .then((res) => setTasks({
        requested: res.data.requested || [],
        todo: res.data.todo || [],
        inProgress: res.data.inProgress || [],
        completed: res.data.completed || [],
      }))
      .catch(() => setError("Error updating task stage."));
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-gray-700 font-bold mb-2">Select Project:</h2>
        <div className="flex flex-wrap gap-2">
          {projects.map((project) => (
            <button
              key={project._id}
              onClick={() => setSelectedProjectId(project._id)}
              className={`px-4 py-2 rounded ${selectedProjectId === project._id ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
            >
              {project.title}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded"
        disabled={!selectedProjectId}
      >
        Add Task
      </button>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(tasks).map(([colId, taskList]) => (
            <Droppable key={colId} droppableId={colId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-4 rounded-lg min-h-[300px]"
                >
                  <h2 className="text-lg font-bold capitalize">{colId.replace(/([A-Z])/g, " $1")}</h2>
                  <p className="text-sm text-gray-500">Tasks: {taskList.length}</p>
                  {taskList.map((task, index) => (
                    <Draggable key={String(task._id)} draggableId={String(task._id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mt-2 p-4 bg-white shadow rounded-md ${snapshot.isDragging ? "ring-2 ring-blue-400" : ""}`}
                        >
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-gray-500">{task.description}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <AddTaskModal
        isAddTaskModalOpen={isModalOpen}
        setAddTaskModal={() => setIsModalOpen(false)}
        projectId={selectedProjectId}
        addTask={addTask}
      />
    </div>
  );
};

export default Tasks;