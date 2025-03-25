import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import Modal from 'react-modal';
import PropTypes from 'prop-types';

function CreateModal({ dashboards, setDashboards, modalIsOpen, setIsOpen }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [path, setPath] = useState("");
    const navigate = useNavigate();
    const widgets = {"Table": [], "Chart": []};

    const dashboardData = async (e) => {
        e.preventDefault();
        try {
            const requestBody = { 
                name, 
                description, 
                path, 
                widgets: { Table: [], Chart: [] }
            };
            console.log("Request Body:", requestBody);
    
            let result = await fetch('http://localhost:3003/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            result = await result.json();
            console.log("Response:", result);
    
            setDashboards([...dashboards, result]);
    
            setName("");
            setDescription("");
            setPath("");
            closeModal();
            navigate(`/dashboard/${result.path}`);
        } catch (err) {
            console.error("Error posting dashboard:", err);
        }
    };
    

    function closeModal() {
        setIsOpen(false);
    }

    const modalStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
    };

    return (
        <div>
            <Modal
                className="h-1/2 absolute top-24 left-1/3 rounded w-1/3 bg-slate-50 shadow"
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={modalStyles}
            >
                <div className="mt-3">
                    <form className="p-5" onSubmit={dashboardData}>
                        <div className="flex mb-3 flex-col">
                            <label className="text-lg font-bold" htmlFor="dashboard-name">Dashboard Name:</label>
                            <input 
                                className="rounded p-2 border"
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Dashboard Name" 
                                type="text"
                                value={name} 
                                name="dashboard-name" 
                                required 
                            />
                        </div>

                        <div className="flex mb-3 flex-col">
                            <label className="text-lg font-bold" htmlFor="dashboard-description">Dashboard Description:</label>
                            <textarea 
                                className="rounded p-2 border"
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add Description" 
                                name="dashboard-description" 
                                value={description} 
                                required
                            ></textarea>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-lg font-bold" htmlFor="dashboard-path">Dashboard Path:</label>
                            <input 
                                className="rounded p-2 border"
                                onChange={(e) => setPath(e.target.value)}
                                placeholder="Path to store your dashboard" 
                                type="text" 
                                value={path} 
                                name="dashboard-path" 
                                required 
                            />
                        </div>

                        <div>
                            <button 
                                className="bg-[#062F6F] hover:bg-[#5779E8] text-white rounded w-full p-1 mt-4" 
                                type="submit"
                            >
                                Submit
                            </button>
                            <button 
                                className="bg-[#5779E8] text-white rounded w-full p-1 mt-2" 
                                type="button"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

CreateModal.propTypes = {
    modalIsOpen: PropTypes.bool.isRequired,
    dashboards: PropTypes.array,
    setDashboards: PropTypes.func.isRequired,
    setIsOpen: PropTypes.func.isRequired
};

export default CreateModal;
