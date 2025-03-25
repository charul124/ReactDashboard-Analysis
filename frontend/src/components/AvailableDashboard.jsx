import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardImg from "../Images/DashboardImg.png";
import PropTypes from 'prop-types';

function AvailableDashboard({ }) {
  const [dashboards, setDashboards] = useState([]);

  // Fetch dashboards from backend
  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const res = await fetch('http://localhost:3003');
        const data = await res.json();
        setDashboards(data);}
      catch (error) {
        console.error(error);
      }
    }
    fetchDashboards();
  },[])

  // Function to delete a dashboard
  const handleDeleteDashboard = async (path) => {
    try {
      const response = await fetch(`http://localhost:3003/dashboard/${path}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete dashboard');
      }
  
      setDashboards((prevDashboards) => prevDashboards.filter(dashboard => dashboard.path !== path));
      alert('Dashboard Deleted');
    } catch (error) {
      console.error("Error deleting dashboard:", error);
    }
  };
  
  return (
    <div className='absolute bottom-10'>
      {Array.isArray(dashboards) && dashboards.length ? (
        <h2 className='text-2xl font-bold text-[#062F6F] text-left px-5 mb-5'>Available Dashboards</h2>
      ) : (
        <h2 className='text-2xl font-bold text-[#062F6F] text-left px-5 mb-5'>No Dashboards Available</h2>
      )}

      <div className='flex'>
        {/* Iterate through dashboards and render each dashboards*/}
        {dashboards.map((dashboard, index) => (
          <div className='flex flex-col text-start shadow-md w-52 rounded-md m-4' key={index}>
            {/* Delete button */}
            <button className="text-lg flex ml-2 text-[#D5074D]" onClick={() => handleDeleteDashboard(dashboard.path)}>
              x
            </button>
            {/* Dashboard image */}
            <img src={DashboardImg} alt="Dashboard Preview" />
            {/* Dashboard details */}
            <h2 className='text-lg ml-3 font-bold'>{dashboard.name}</h2>
            <p className='flex-1 ml-3'>{dashboard.description}</p>
            {/* Link to view the dashboard */}
            <Link className="border border-slate-800 hover:bg-[#D0DBF8] rounded-md text-center m-2 p-1 text-sm" to={`/dashboard/${dashboard.path}`}>
              View Dashboard
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

AvailableDashboard.propTypes = {
  dashboards: PropTypes.array.isRequired,
  handleDeleteDashboard: PropTypes.func.isRequired,
};

export default AvailableDashboard;
