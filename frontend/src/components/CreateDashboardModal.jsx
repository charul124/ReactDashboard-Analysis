import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import Modal from 'react-modal';
import PropTypes from 'prop-types';

function CreateDashboardModal({ modalIsOpen, setIsOpen }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [path, setPath] = useState("");
    const navigate = useNavigate();

    // Close the modal
    function closeModal() {
        setIsOpen(false);
    }

    // Function to handle form submission and send dashboard data to the server
    const dashboardData = async (e) => {
        e.preventDefault();
        try {
            const requestBody = { 
                name, 
                description, 
                path,
            };
            console.log("Request Body:", requestBody);
    
            // Send a POST request to the server with the dashboard data
            let result = await fetch('http://localhost:3003/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            result = await result.json();
            console.log("Response:", result);
    
            setName("");
            setDescription("");
            setPath("");
            closeModal();
            navigate(`/dashboard/${result.path}`);
        } catch (err) {
            console.error("Error posting dashboard:", err);
        }
    };

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
                    {/* Modal content */}
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


// Define prop types for the component
CreateDashboardModal.propTypes = {
    modalIsOpen: PropTypes.bool.isRequired,
    dashboards: PropTypes.array,
    setDashboards: PropTypes.func.isRequired,
    setIsOpen: PropTypes.func.isRequired
};

export default CreateDashboardModal;
