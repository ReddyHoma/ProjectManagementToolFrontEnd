import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddTaskModal from "../components/AddTaskModal";

const initialTasks = {
  "todo": [],
  "inProgress": [],
  "completed": [],
};

const Tasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTask = (newTask) => {
    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, { id: Date.now().toString(), ...newTask }],
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const taskList = Array.from(tasks[sourceCol]);
    const [movedTask] = taskList.splice(source.index, 1);

    if (sourceCol === destCol) {
      taskList.splice(destination.index, 0, movedTask);
      setTasks({ ...tasks, [sourceCol]: taskList });
    } else {
      const destList = Array.from(tasks[destCol]);
      destList.splice(destination.index, 0, movedTask);
      setTasks({ ...tasks, [sourceCol]: taskList, [destCol]: destList });
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded"
      >
        Add Task
      </button>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(tasks).map(([colId, taskList]) => (
            <Droppable key={colId} droppableId={colId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-4 rounded-lg min-h-[300px]"
                >
                  <h2 className="text-lg font-bold capitalize">{colId.replace(/([A-Z])/g, " $1")}</h2>
                  {taskList.map((task, index) => (
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
        setAddTaskModal={setIsModalOpen}
        addTask={addTask}
      />
    </div>
  );
};

export default Tasks;
