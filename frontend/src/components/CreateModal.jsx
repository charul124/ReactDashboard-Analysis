import { useState, useEffect } from "react";
import React from "react";
import Modal from 'react-modal';
import PropTypes from 'prop-types';


function CreateModal({ dashboards, setDashboards, modalIsOpen, setIsOpen }) {
    
    // State variables to store user input values
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [path, setPath] = useState("");

    // Handlers to update state based on user input
    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handlePathChange(e) {
        setPath(e.target.value);
    }

    // Load dashboards from localStorage when the component mounts
    useEffect(() => {
        const storedDashboards = JSON.parse(localStorage.getItem("dashboards")) || []; 
        setDashboards(storedDashboards);
    }, [setDashboards]); 

    function handleSubmit(e) {
        e.preventDefault();

        // Create a new dashboard object
        const newDashboard = {
            name: name,
            description: description,
            path: path
        };
        
        // Store the new dashboard in localStorage
        localStorage.setItem(`dashboard_${path}`, JSON.stringify(newDashboard));

        // Update the dashboards state and localStorage
        const updatedDashboards = [...dashboards, newDashboard];
        setDashboards(updatedDashboards);
        localStorage.setItem("dashboards", JSON.stringify(updatedDashboards));

        // Reset form fields
        setName("");
        setDescription("");
        setPath("");
    }

    // Function to close the modal
    function closeModal() {
        setIsOpen(false);
    }

    // Custom styles for the modal overlay
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
                    {/* Form to collect dashboard details */}
                    <form className="p-5" onSubmit={handleSubmit}>
                        {/* Input field for dashboard name */}
                        <div className="flex mb-3 flex-col">
                            <label className="text-lg font-bold" htmlFor="dashboard-name">Dashboard Name:</label>
                            <input 
                                className="rounded p-2 border"
                                onChange={handleNameChange}
                                placeholder="Your Dashboard Name" 
                                type="text"
                                value={name} 
                                name="dashboard-name" 
                                required 
                            />
                        </div>

                        {/* Input field for dashboard description */}
                        <div className="flex mb-3 flex-col">
                            <label className="text-lg font-bold" htmlFor="dashboard-description">Dashboard Description:</label>
                            <textarea 
                                className="rounded p-2 border"
                                onChange={handleDescriptionChange}
                                placeholder="Add Description" 
                                name="dashboard-description" 
                                value={description} 
                                id="dashboard-description" 
                                required
                            ></textarea>
                        </div>

                        {/* Input field for dashboard path */}
                        <div className="flex flex-col">
                            <label className="text-lg font-bold" htmlFor="dashboard-path">Dashboard Path:</label>
                            <input 
                                className="rounded p-2 border"
                                onChange={handlePathChange} 
                                placeholder="Path to store your dashboard" 
                                type="text" 
                                value={path} 
                                name="dashboard-path" 
                                required 
                            />
                        </div>

                        {/* Submit and Close buttons */}
                        <div>
                            <button 
                                className="bg-[#062F6F] hover:bg-[#5779E8] text-white rounded w-full p-1 mt-4" 
                                onClick={(e) => { handleSubmit(e); closeModal(); }} 
                            >
                                Submit
                            </button>
                            <button 
                                className="bg-[#5779E8] text-white rounded w-full p-1 mt-2" 
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

// Define prop types for better validation
CreateModal.propTypes = {
    modalIsOpen: PropTypes.bool.isRequired,
    dashboards: PropTypes.array,
    setDashboards: PropTypes.func,
    setIsOpen: PropTypes.func
};

export default CreateModal;
