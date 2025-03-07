import React, { Fragment, memo, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import BtnPrimary from './BtnPrimary';
import BtnSecondary from './BtnSecondary';
import axios from "axios";
import toast from 'react-hot-toast';

const AddProjectModal = ({ isModalOpen, closeModal, edit = false, id = null }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        if (edit && isModalOpen) {
            axios.get(`http://localhost:9000/projects/${id}`)
                .then((res) => {
                    if (res.data.length > 0) {
                        setTitle(res.data[0].title);
                        setDescription(res.data[0].description);
                    }
                })
                .catch((error) => {
                    console.error("Fetch error:", error);
                    toast.error("Error fetching project details");
                });
        }
    }, [isModalOpen, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true); 
        const payload = {
            title,
            description
        };

        console.log("Payload being sent :", payload);

        try {
            let response;
            if (!edit) {
                response = await axios.post('http://localhost:9000/projects', payload);
                toast.success('Project created successfully');
            } else {
                response = await axios.put(`http://localhost:9000/projects/${id}`, payload);
                toast.success('Project updated successfully');
            }

            console.log("Project saved:", response.data);

            document.dispatchEvent(new CustomEvent('projectUpdate'));

            closeModal();

            setTitle('');
            setDescription('');
        } catch (error) {
            console.error("API Error:", error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false); 
        }
    };

    return (
        <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog as='div' open={isModalOpen} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 overflow-y-auto">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>
                    <div className="fixed inset-0 flex items-center justify-center p-4 w-screen h-screen">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="rounded-md bg-white w-6/12">
                                <Dialog.Title className="bg-white shadow px-6 py-4 rounded-t-md sticky top-0">
                                    {edit ? "Edit Project" : "Create Project"}
                                    <button onClick={closeModal} className='absolute right-6 top-4 text-gray-500 hover:bg-gray-100 rounded focus:outline-none'>
                                        ✖
                                    </button>
                                </Dialog.Title>
                                <form onSubmit={handleSubmit} className='gap-4 px-8 py-4'>
                                    <div className='mb-3'>
                                        <label className='block text-gray-600'>Title</label>
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            type="text"
                                            className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5'
                                            placeholder='Project title'
                                            required
                                        />
                                    </div>
                                    <div className='mb-2'>
                                        <label className='block text-gray-600'>Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5'
                                            rows="6"
                                            placeholder='Project description'
                                            required
                                        ></textarea>
                                    </div>
                                    <div className='flex justify-end items-center space-x-2'>
                                        <BtnSecondary onClick={closeModal}>Cancel</BtnSecondary>
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
    );
};

export default memo(AddProjectModal);
