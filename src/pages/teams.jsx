import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

const roles = {
    Developer: 'bg-blue-500',
    Designer: 'bg-green-500',
    Manager: 'bg-red-500',
    QA: 'bg-yellow-500'
};

const initialTeams = {
    ReactJS: [],
    TailwindCSS: [],
    TeamName: []
};

const Teams = () => {
    const [teams, setTeams] = useState(initialTeams);
    const [newMember, setNewMember] = useState({ name: '', role: 'Developer' });
    const [selectedTeam, setSelectedTeam] = useState('ReactJS');

    const handleAddMember = () => {
        if (!newMember.name) return;
        const member = { id: uuidv4(), name: newMember.name, role: newMember.role };
        setTeams({
            ...teams,
            [selectedTeam]: [...teams[selectedTeam], member]
        });
        setNewMember({ name: '', role: 'Developer' });
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        
        const { source, destination } = result;
        const sourceTeam = teams[source.droppableId];
        const destTeam = teams[destination.droppableId];
        const [movedItem] = sourceTeam.splice(source.index, 1);
        destTeam.splice(destination.index, 0, movedItem);

        setTeams({
            ...teams,
            [source.droppableId]: sourceTeam,
            [destination.droppableId]: destTeam
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Team Management</h1>
            
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
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="border p-2 rounded"
                >
                    {Object.keys(teams).map((team) => (
                        <option key={team} value={team}>{team}</option>
                    ))}
                </select>
                <button onClick={handleAddMember} className="bg-indigo-600 text-white px-4 py-2 rounded">Add</button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-2 gap-6">
                    {Object.keys(teams).map((team) => (
                        <Droppable key={team} droppableId={team}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-100 p-4 rounded shadow-md min-h-[200px]"
                                >
                                    <h2 className="text-lg font-bold mb-2">{team}</h2>
                                    {teams[team].map((member, index) => (
                                        <Draggable key={member.id} draggableId={member.id} index={index}>
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
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Teams;