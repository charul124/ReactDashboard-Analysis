import React, { useState, useEffect } from 'react';
import AvailableDashboard from '../components/AvailableDashboard';
import CreateDashboardModal from '../components/CreateDashboardModal';

// Home Component - Main page for creating and managing dashboards.
function Home() {
    const [modalIsOpen, setIsOpen] = useState(false);
    
    //Open the create dashboard modal.
    function openModal() {
        setIsOpen(true);
    }
    
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
            <CreateDashboardModal
                modalIsOpen={modalIsOpen} 
                setIsOpen={setIsOpen} 
            />

            {/* Render Available Dashboards */}
            <AvailableDashboard />
        </div>
    );
}

export default Home;
