import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
// import Attachment from '../image/attachment.jpg'
import axios from 'axios'
import toast from 'react-hot-toast'

const TaskModal = ({ isOpen, setIsOpen, id, refreshData }) => {
    const [taskData, setTaskData] = useState({ title: '', description: '' })
    const [isEditing, setIsEditing] = useState(false)

    const capitalizeFirstLetter = (string) => {
        return string ? string.charAt(0).toUpperCase() + string.slice(1) : ''
    }

    useEffect(() => {
        if (isOpen && id.projectId && id.id) {
            axios.get(`http://localhost:9000/projects/${id.projectId}/tasks/${id.taskId}`)
                .then((res) => {
                    setTaskData(res.data.task);
                    // console.log(taskData);
                })
                .catch(() => {
                    toast.error('something went wrong')
                })
        }
    }, [isOpen, id]);

    const handleInputChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:9000/projects/${id.projectId}/tasks/${id.taskId}`, {
                title: taskData.title,
                description: taskData.description,
            });
            toast.success('Task updated successfully');
            setIsEditing(false);
            refreshData(); // Refresh task list after update
        } catch (error) {
            toast.error('Failed to update task');
        }
    };


    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as='div' open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 overflow-y-auto">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>
                    <div className="fixed inset-0 flex items-center justify-center p-4 w-screen h-screen">
                        {/* <div className="fixed inset-0 "> */}
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="rounded-md bg-white max-w-[85%] w-[85%] h-[85%] overflow-y-hidden">

                                <Dialog.Title className="bg-white shadow px-6 py-4 rounded-t-md sticky top-0 flex justify-between">
                                    <h1>Task details</h1>
                                    <button onClick={() => setIsOpen(false)} className='text-gray-500 hover:bg-gray-100 rounded focus:outline-none focus:ring focus:ring-offset-1 focus:ring-gray-500/30 '>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dialog.Title>
                                <div className='flex gap-4 h-[inherit] p-6'>
                                    {/* Left Side */}
                                    <div className="w-8/12 space-y-3">
                                        <h1 className='text-3xl font-semibold'>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={taskData.title}
                                                    onChange={handleInputChange}
                                                    className="border border-gray-300 rounded-md w-full text-xl py-2 px-2.5 focus:border-indigo-500 focus:outline-none"
                                                />
                                            ) : (
                                                capitalizeFirstLetter(taskData.title)
                                            )}
                                        </h1>

                                        <p className='text-gray-600'>
                                            {isEditing ? (
                                                <textarea
                                                    name="description"
                                                    value={taskData.description}
                                                    onChange={handleInputChange}
                                                    className="border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-none"
                                                    rows="6"
                                                />
                                            ) : (
                                                capitalizeFirstLetter(taskData.description)
                                            )}
                                        </p>

                                        {/* Edit & Save Buttons */}
                                        <div className="mt-4">
                                            {isEditing ? (
                                                <button
                                                    onClick={handleUpdate}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                                >
                                                    Save Changes
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300 transition"
                                                >
                                                    Edit Task
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Side */}
                                    <div className="w-4/12 py-4 pr-4">
                                        {/* Add extra task details here if needed */}
                                    </div>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default TaskModal;