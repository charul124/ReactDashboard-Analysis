import React, { useState, useEffect } from 'react';
import AvailableDashboard from '../components/AvailableDashboard';
import CreateModal from '../components/CreateModal';

// Home Component - Main page for creating and managing dashboards.
function Home() {
    // State to store the list of dashboards and modal visibility
    const [dashboards, setDashboards] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);

    //Load dashboards from localStorage when the component mounts.
    useEffect(() => {
        const storedDashboards = JSON.parse(localStorage.getItem('dashboards')) || [];
        setDashboards(storedDashboards);
    }, []);
    
    //Open the create dashboard modal.
    function openModal() {
        setIsOpen(true);
    }

    //Delete the dashboard with the given path.
    const handleDeleteDashboard = (path) => {
        console.log("Deleting dashboard with path:", path);
        const updatedDashboards = dashboards.filter(dashboard => dashboard.path !== path);
        // Update the state with the new dashboards list
        setDashboards(updatedDashboards);

        // Store updated dashboards list in localStorage
        localStorage.setItem('dashboards', JSON.stringify(updatedDashboards));
        alert("Dashboard Deleted");
    };

    return (
        <div className="text-center">
            {/* Page header */}
            <h1 className="text-2xl text-start font-extrabold p-2 text-[#062F6F] h-12 bg-[#D0DBF8]">
                Analytics Dashboard
            </h1>

            {/* Create Dashboard Section */}
            <div className='mt-7'>
                <h1 className='text-3xl font-bold text-gray-700'>Create your own Analysis Dashboards</h1>
                <button onClick={openModal} className="h-8 px-2 mt-2 bg-[#062F6F] rounded-md text-white">
                    Create Dashboard
                </button>
            </div>

            {/* Render the Create Modal */}
            <CreateModal 
                dashboards={dashboards} 
                setDashboards={setDashboards} 
                modalIsOpen={modalIsOpen} 
                setIsOpen={setIsOpen} 
            />

            {/* Render Available Dashboards */}
            <AvailableDashboard 
                dashboards={dashboards} 
                handleDeleteDashboard={handleDeleteDashboard} 
            />
        </div>
    );
}

export default Home;
