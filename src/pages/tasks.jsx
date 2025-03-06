import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import AddTaskModal from "../components/AddTaskModal";
import BtnPrimary from "../components/BtnPrimary";
import TaskModal from "../components/TaskModal";
import ProjectTabs from "../components/ProjectTabs";

const COLUMN_KEYS = {
    REQUESTED: "requested",
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done",
};

function Tasks() {
    const [isAddTaskModalOpen, setAddTaskModal] = useState(false);
    const [columns, setColumns] = useState({});
    const [isRenderChange, setRenderChange] = useState(false);
    const [isTaskOpen, setTaskOpen] = useState(false);
    const [taskId, setTaskId] = useState(null);
    const [title, setTitle] = useState("");
    const { projectId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!projectId) return;
        if (!isAddTaskModalOpen || isRenderChange) {
            axios.get(`http://localhost:9000/projects/${projectId}`)
                .then((res) => {
                    setTitle(res.data[0]?.title || "Untitled Project");
                    const tasks = res.data[0]?.task || [];
                    setColumns({
                        [COLUMN_KEYS.REQUESTED]: { name: "Requested", items: tasks.filter(task => task.stage === "Requested") },
                        [COLUMN_KEYS.TODO]: { name: "To Do", items: tasks.filter(task => task.stage === "To do") },
                        [COLUMN_KEYS.IN_PROGRESS]: { name: "In Progress", items: tasks.filter(task => task.stage === "In Progress") },
                        [COLUMN_KEYS.DONE]: { name: "Done", items: tasks.filter(task => task.stage === "Done") },
                    });
                    setRenderChange(false);
                })
                .catch(() => {
                    toast.error("Something went wrong");
                });
        }
    }, [projectId, isAddTaskModalOpen, isRenderChange]);

    const updateTodo = (data) => {
        axios.put(`http://localhost:9000/projects/${projectId}/todo`, data)
            .catch(() => toast.error("Something went wrong"));
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;
        const newColumns = { ...columns };
        const sourceItems = [...newColumns[source.droppableId].items];
        const [removed] = sourceItems.splice(source.index, 1);
        newColumns[destination.droppableId].items.splice(destination.index, 0, removed);
        setColumns(newColumns);
        updateTodo(newColumns);
    };

    const handleDelete = (e, taskId) => {
        e.stopPropagation();
        axios.delete(`http://localhost:9000/projects/${projectId}/tasks/${taskId}`)
            .then(() => {
                toast.success("Task deleted");
                setRenderChange(true);
            })
            .catch(() => toast.error("Something went wrong"));
    };

    return (
        <div className='px-12 py-6 w-full'>
            <ProjectTabs projectId={projectId} navigate={navigate} />
            <div className='flex items-center justify-between mb-6'>
                <h1 className='text-xl text-gray-800'>{title}</h1>
                <BtnPrimary onClick={() => setAddTaskModal(true)}>Add Task</BtnPrimary>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='flex gap-5'>
                    {Object.entries(columns).map(([columnId, column]) => (
                        <div key={columnId} className='w-3/12 h-[580px]'>
                            <h2 className='text-[#1e293b] font-medium text-sm uppercase'>{column.name} ({column.items.length})</h2>
                            <Droppable droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`min-h-[530px] pt-4 border-t-2 ${snapshot.isDraggingOver ? 'border-indigo-600' : 'border-indigo-400'}`}
                                    >
                                        {column.items.map((item, index) => (
                                            <Draggable key={item._id} draggableId={item._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`px-3.5 pt-3.5 pb-2.5 mb-2 border rounded-lg shadow-sm bg-white relative ${snapshot.isDragging && 'shadow-md'}`}
                                                        onClick={() => { setTaskId(item._id); setTaskOpen(true); }}
                                                    >
                                                        <h3 className='text-[#1e293b] font-medium text-sm'>{item.title}</h3>
                                                        <p className='text-xs text-slate-500'>{item.description.slice(0, 60)}{item.description.length > 60 && '...'}</p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
            <AddTaskModal isAddTaskModalOpen={isAddTaskModalOpen} setAddTaskModal={setAddTaskModal} projectId={projectId} />
            <TaskModal isOpen={isTaskOpen} setIsOpen={setTaskOpen} id={taskId} />
        </div>
    );
}

export default Tasks;
