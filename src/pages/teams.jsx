import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

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
        axios.get("http://localhost:9000/projects")
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

        axios.post(`http://localhost:9000/projects/${selectedProjectId}/members`, member)
            .then(() => axios.get("http://localhost:9000/projects"))
            .then((res) => setProjects(res.data))
            .catch((err) => console.error("Error adding member:", err));

        setNewMember({ name: "", role: "Developer" });
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        const sourceProject = projects.find((p) => p._id === source.droppableId);
        const destProject = projects.find((p) => p._id === destination.droppableId);

        if (!sourceProject || !destProject) return;

        const movedMembers = [...(sourceProject.members || [])];
        const [movedMember] = movedMembers.splice(source.index, 1);

        if (!movedMember || !movedMember.id) {
            console.error("Error: Moved member does not have a valid ID.");
            return;
        }

        const updatedSource = { ...sourceProject, members: movedMembers };
        const updatedDest = { ...destProject, members: [...(destProject.members || []), movedMember] };

        setProjects((prevProjects) =>
            prevProjects.map((p) =>
                p._id === updatedSource._id ? updatedSource : p._id === updatedDest._id ? updatedDest : p
            )
        );

        axios.put(`http://localhost:9000/projects/${destProject._id}/members/${movedMember.id}`, {
            newProjectId: destProject._id,
        })
            .then(() => console.log("Member moved successfully"))
            .catch((err) => console.error("Error moving member:", err));
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Team Management</h1>
            {loading ? (
                <p>Loading projects...</p>
            ) : (
                <>
                    <div className="flex gap-3 mb-6">
                        <input
                            type="text"
                            placeholder="Member Name"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            className="border p-2 rounded w-full"
                        />
                        <select
                            value={newMember.role}
                            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                            className="border p-2 rounded"
                        >
                            {Object.keys(roles).map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        <select
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="border p-2 rounded"
                        >
                            {projects.map((project) => (
                                <option key={project._id} value={project._id}>{project.title}</option>
                            ))}
                        </select>
                        <button onClick={handleAddMember} className="bg-indigo-600 text-white px-4 py-2 rounded">
                            Add
                        </button>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="grid grid-cols-2 gap-6">
                            {projects.map((project) => (
                                <Droppable key={project._id} droppableId={project._id}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="bg-gray-100 p-4 rounded shadow-md min-h-[200px]"
                                        >
                                            <h2 className="text-lg font-bold mb-2">{project.title}</h2>
                                            {project.members?.length > 0 ? (
                                                project.members.map((member, index) => (
                                                    <Draggable key={String(member.id)} draggableId={String(member.id)} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="bg-white p-3 rounded shadow mb-2 flex items-center gap-3"
                                                            >
                                                                <span className={`w-3 h-3 rounded-full ${roles[member.role]}`} />
                                                                <span className="font-semibold">{member.name}</span>
                                                                <span className="text-gray-600 text-sm">({member.role})</span>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-sm">No members</p>
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </DragDropContext>
                </>
            )}
        </div>
    );
};

export default Teams;