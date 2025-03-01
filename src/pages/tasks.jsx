import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddTaskModal from "../components/AddTaskModal";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState({ requested: [], todo: [], inProgress: [], completed: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projects, setProjects] = useState([]);

  // Fetch project list on mount
  useEffect(() => {
    axios.get("http://localhost:9000/projects")
      .then((res) => {
        console.log("Fetched projects:", res.data);
        setProjects(res.data);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  // Fetch tasks when a project is selected
  useEffect(() => {
    if (!selectedProjectId) return;

    axios.get(`http://localhost:9000/projects/${selectedProjectId}/task`)
      .then((res) => {
        if (typeof res.data === "object" && res.data !== null) {
          setTasks({
            requested: Array.isArray(res.data.requested) ? res.data.requested : [],
            todo: Array.isArray(res.data.todo) ? res.data.todo : [],
            inProgress: Array.isArray(res.data.inProgress) ? res.data.inProgress : [],
            completed: Array.isArray(res.data.completed) ? res.data.completed : [],
          });
        } else {
          console.warn("Unexpected API response, resetting tasks.");
          setTasks({ requested: [], todo: [], inProgress: [], completed: [] });
        }
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [selectedProjectId]);

  // Add a new task to the state
  const addTask = (newTask) => {
    setTasks((prev) => ({
      ...prev,
      requested: [...prev.requested, { id: Date.now().toString(), ...newTask }],
    }));
  };

  // Handle drag and drop and update backend
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const taskList = Array.isArray(tasks[sourceCol]) ? [...tasks[sourceCol]] : [];
    const [movedTask] = taskList.splice(source.index, 1);

    if (sourceCol === destCol) {
      taskList.splice(destination.index, 0, movedTask);
      setTasks({ ...tasks, [sourceCol]: taskList });
    } else {
      const destList = Array.isArray(tasks[destCol]) ? [...tasks[destCol]] : [];
      destList.splice(destination.index, 0, movedTask);
      setTasks({ ...tasks, [sourceCol]: taskList, [destCol]: destList });

      // Update backend
      axios.put(`http://localhost:9000/tasks/${movedTask.id}`, { stage: destCol })
        .catch((err) => console.error("Error updating task stage:", err));
    }
  };

  return (
    <div className="p-6">
      {/* Project Selection as Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        {projects.map((project) => (
          <button
            key={project._id}
            className={`px-4 py-2 ${
              selectedProjectId === project._id ? "border-b-2 border-blue-500 font-bold" : ""
            }`}
            onClick={() => setSelectedProjectId(project._id)}
          >
            {project.title}
          </button>
        ))}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded"
        disabled={!selectedProjectId}
      >
        Add Task
      </button>

      {/* Drag and Drop Context */}
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
                  {Array.isArray(taskList) && taskList.length > 0 ? (
                    taskList.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mt-2 p-4 bg-white shadow rounded-md"
                          >
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm text-gray-500">{task.description}</p>
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No tasks</p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Add Task Modal */}
      <AddTaskModal
        isAddTaskModalOpen={isModalOpen}
        setAddTaskModal={setIsModalOpen}
        projectId={selectedProjectId}
        addTask={addTask}
      />
    </div>
  );
};

export default Tasks;
