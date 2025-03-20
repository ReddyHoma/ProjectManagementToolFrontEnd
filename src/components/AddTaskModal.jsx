import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import BtnPrimary from './BtnPrimary'
import BtnSecondary from './BtnSecondary'
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




const AddTaskModal = ({ isAddTaskModalOpen, setAddTaskModal, projectId = null, taskId = null, edit = false, refreshData }) => {

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (edit && isAddTaskModalOpen && projectId && taskId) {
            axios.get(`http://localhost:9000/projects/${projectId}/tasks/${taskId}`)
                .then((res) => {
                    setTitle(res.data[0].task[0].title)
                    setDesc(res.data[0].task[0].description)
                })
                .catch(() => {
                    toast.error('Something went wrong')
                })
            console.log('edit function call')
        }
    }, [isAddTaskModalOpen, edit, projectId, taskId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log("Submitting task...");

        if (!title || title.length < 3) {
            toast.error("Title must be at least 3 characters long");
            setLoading(false);
            return;
        }

        if (!desc.trim()) {
            toast.error("Description cannot be empty");
            setLoading(false);
            return;
        }

        try {
            let response;
            if (edit) {
                // Update task
                response = await axios.put(`http://localhost:9000/projects/${projectId}/tasks/${taskId}`, {
                    title,
                    description: desc,
                });
                toast.success('Task updated successfully');
            } else {
                // Create new task
                response = await axios.post(`http://localhost:9000/projects/${projectId}/tasks`, {
                    title,
                    description: desc,
                });
                toast.success('Task created successfully');
            }

            console.log("Task saved:", response.data);
            document.dispatchEvent(new CustomEvent('taskUpdate'));
            setAddTaskModal(false); // Close modal
            setTitle('');
            setDesc('');
        } catch (error) {
            console.error("API Error:", error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false); // ✅ Remove loading state
        }
    };

    return (
        <Transition appear show={isAddTaskModalOpen} as={Fragment}>
            <Dialog as='div' open={isAddTaskModalOpen} onClose={() => setAddTaskModal(false)} className="relative z-50">
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
                            <Dialog.Panel className="rounded-md bg-white w-6/12">

                                <Dialog.Title as='div' className={'bg-white shadow px-6 py-4 rounded-t-md sticky top-0 flex justify-between'}>
                                    <h1>{edit ? 'Edit Task' : 'Add Task'}</h1>
                                    <button onClick={() => setAddTaskModal(false)} className='text-gray-500 hover:bg-gray-100 rounded focus:outline-none focus:ring focus:ring-offset-1 focus:ring-indigo-200'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dialog.Title>
                                <form onSubmit={handleSubmit} className='gap-4 px-8 py-4'>
                                    <div className='mb-3'>
                                        <label htmlFor="title" className='block text-gray-600'>Title</label>
                                        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400' placeholder='Task title' required />
                                    </div>
                                    <div className='mb-2'>
                                        <label htmlFor="Description" className='block text-gray-600'>Description</label>
                                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400' rows="6" placeholder='Task description' required ></textarea>
                                    </div>
                                    <div className='flex justify-end items-center space-x-2'>
                                        <BtnSecondary onClick={() => setAddTaskModal(false)}>Cancel</BtnSecondary>
                                        <BtnPrimary type="submit" disabled={loading}>
                                            {loading ? "Saving..." : "Save"}
                                        </BtnPrimary>
                                    </div>
                                </form>

                            </Dialog.Panel>
                        </Transition.Child>

                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default AddTaskModal