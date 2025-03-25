import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ChartWidget from '../components/widgets/ChartWidget';
import CreateTable from '../components/widgets/CreateTable';
import WidgetDrawer from '../components/WidgetDrawer';
import TableModal from '../components/TableModal';

function Dashboard() {
  const { path } = useParams();
  const [widgets, setWidgets] = useState({ Table: [], Chart: [] });
  const [isOpen, setIsOpen] = useState(false);
  // States to store the current Table widget id for headings
  const [currentTableId, setCurrentTableId] = useState(null);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`http://localhost:3003/dashboard/${path}`);
        if (!response.ok) throw new Error('Failed to fetch dashboard');
        
        const data = await response.json();
        setWidgets(data.widgets || { Table: [], Chart: [] });
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };
    fetchDashboard();
  }, [path]);

  // Open modal when a Table widget is added
  function openModal(id) {
    setCurrentTableId(id);
    setIsOpen(true);
  }

  // Save headings and add the table widget
  function handleHeadings(id, selectedHeadings) {
    setWidgets(prevWidgets => ({
      ...prevWidgets,
      Table: [...prevWidgets.Table, { [id]: { height: "300px", width: "500px", headings: selectedHeadings } }]
    }));
  }

  // Save dashboard with updated widgets
  const saveDashboardToBackend = async () => {
    console.log("Saving dashboard:", widgets);
    try {
      const response = await fetch(`http://localhost:3003/dashboard/${path}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widgets }),
      });

      if (!response.ok) throw new Error('Failed to save dashboard');
      alert('Dashboard saved successfully!');
    } catch (error) {
      console.error("Error saving dashboard:", error);
    }
  };

  // Handle drop to add new widget
  const handleDrop = (e) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData('widgetType');
    if (!widgetType) return;

    const widgetId = `widget_${Date.now()}`;
    let newWidget = { height: "300px", width: "500px", x: e.clientX, y: e.clientY };

    if (widgetType === "Table") {
      openModal(widgetId);
    } else if (widgetType === "Chart") {
      newWidget = { ...newWidget, chartType: "Bar", savedfilters: { startDate: "2024-12-14", endDate: "2025-11-14" } };
      setWidgets(prevWidgets => ({
        ...prevWidgets,
        Chart: [...prevWidgets.Chart, { [widgetId]: newWidget }]
      }));
    }
  };

  // Update widget position and size
  const updatePosition = (id,type, x, y, width, height) => 
    setWidgets(prev => ({
    ...prev, [type]: prev[type].map(widget => widget[id] ? { [id]: { ...widget[id], x, y, width, height } } : widget)
  }))

  // Delete widget by id
  const handleDeleteWidget = (id) => {
    setWidgets(prevWidgets => {
      const updatedWidgets = { ...prevWidgets };

      for (const type in updatedWidgets) {
        updatedWidgets[type] = updatedWidgets[type].filter(widget => {
          const widgetId = Object.keys(widget)[0];
          return widgetId !== id;
        });
      }

      return updatedWidgets;
    });
  };

  return (
    <div className='flex h-screen mt-3'>
      {/* Sidebar */}
      <div className='border-r-2 flex flex-col text-center border-gray-500'>
        <h1 className='font-bold text-[#062F6F]'>WIDGETS</h1>
        <div>
          {['Chart', 'Table'].map((widget, index) => (
            <WidgetDrawer key={index} name={widget} type={widget} />
          ))}
        </div>
        <Link to="/" onClick={saveDashboardToBackend} className='bg-[#5779E8] mx-4 p-2 hover:bg-[#062F6F] text-white font-bold rounded mt-4'>
          Publish
        </Link>
      </div>

      {/* Main Dashboard Area */}
      <div className='w-full text-center' onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        <h1 className='font-bold text-[#062F6F]'>YOUR DASHBOARD</h1>
        {Object.entries(widgets).map(([type, widgetArray]) =>
          widgetArray.map(widgetObj => {
            const [widgetId, widgetData] = Object.entries(widgetObj)[0];

            return type === "Chart" ? (
              <ChartWidget
                key={widgetId}
                id={widgetId}
                savedFilters={widgetData.savedfilters}
                {...widgetData}
                updatePosition={(id, x, y, width, height) => updatePosition(id, type, x, y, width, height)}
                updateChartType={(id, chartType) => 
                  setWidgets(prev => ({
                  ...prev, [type]: prev[type].map(widget => widget[id] ? { [id]: { ...widget[id], chartType } } : widget)
                }))}
                updateFilters={(id, startDate, endDate) => setWidgets(prev => ({
                  ...prev,
                  [type]: prev[type].map(widget => 
                    widget[id] 
                      ? { [id]: { ...widget[id], savedfilters: { startDate, endDate } } } 
                      : widget
                  )
                }))}
                handleDeleteWidget={handleDeleteWidget}
              />
            ) : (
              <CreateTable
                key={widgetId}
                id={widgetId}
                {...widgetData}
                updatePosition={(id, x, y, width, height) => updatePosition(id, type, x, y, width, height)}
                handleDeleteWidget={handleDeleteWidget}
              />
            );
          })
        )}
      </div>
      {/* Table Headings Selection Modal */}
      <TableModal
        id={currentTableId}
        IsOpen={isOpen}
        setIsOpen={setIsOpen}
        handleHeadings={handleHeadings}
      />
    </div>
  );
}

export default Dashboard;
