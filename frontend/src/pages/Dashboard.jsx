import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ChartWidget from '../components/widgets/ChartWidget';
import CreateTable from '../components/widgets/CreateTable';
import WidgetDrawer from '../components/WidgetDrawer';
import TableModal from '../components/TableModal';

function Dashboard() {
  const { path } = useParams();
  const [widgets, setWidgets] = useState({ Table: [], Chart: [] });
  const [headings, setHeadings] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentWidgetId, setCurrentWidgetId] = useState(null);
  const [pendingWidget, setPendingWidget] = useState(null);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`http://localhost:3003/dashboard/${path}`);
        if (!response.ok) throw new Error('Failed to fetch dashboard');
        
        const data = await response.json();
        console.log("Fetched dashboard data:", data.widgets);
        setWidgets(data.widgets || { Table: [], Chart: [] });
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };
    fetchDashboard();
  }, [path]);

  // Open modal when a Table widget is added
  function openModal(id) {
    setCurrentWidgetId(id);
    setIsOpen(true);
  }

  // Save headings and add the table widget
  function handleHeadings(id, selectedHeadings) {
    console.log("Received headings:", selectedHeadings);
    setHeadings(selectedHeadings);

    if (pendingWidget) {
      setWidgets(prevWidgets => ({
        ...prevWidgets,
        Table: [...prevWidgets.Table, { [id]: { ...pendingWidget, headings: selectedHeadings } }]
      }));
      setPendingWidget(null);
    }
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
    let newWidget = { height: "300px", width: "500px" };

    if (widgetType === "Table") {
      setPendingWidget(newWidget);
      openModal(widgetId);
    } else if (widgetType === "Chart") {
      newWidget = { ...newWidget, chartType: "Line", savedfilters: { startDate: "2024-12-14", endDate: "2025-11-14" } };
      setWidgets(prevWidgets => ({
        ...prevWidgets,
        Chart: [...prevWidgets.Chart, { [widgetId]: newWidget }]
      }));
    }
  };

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
      <div className='border-r-2 flex flex-col text-center w-1/5 border-gray-500'>
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
      <div className='w-4/5 text-center' onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        <h1 className='font-bold text-[#062F6F]'>YOUR DASHBOARD</h1>
        {Object.entries(widgets).map(([type, widgetArray]) =>
          widgetArray.map(widgetObj => {
            const [widgetId, widgetData] = Object.entries(widgetObj)[0];

            return type === "Chart" ? (
              <ChartWidget
                key={widgetId}
                id={widgetId}
                savedFilters={widgetData.savedfilters} // Pass savedFilters here
                {...widgetData}
                updatePosition={(id, x, y, width, height) => setWidgets(prev => ({
                  ...prev, [type]: prev[type].map(w => w[id] ? { [id]: { ...w[id], x, y, width, height } } : w)
                }))}
                updateChartType={(id, chartType) => setWidgets(prev => ({
                  ...prev, [type]: prev[type].map(w => w[id] ? { [id]: { ...w[id], chartType } } : w)
                }))}
                updateFilters={(id, startDate, endDate) => setWidgets(prev => ({
                  ...prev,
                  [type]: prev[type].map(w => 
                    w[id] 
                      ? { [id]: { ...w[id], savedfilters: { startDate, endDate } } } 
                      : w
                  )
                }))}
                handleDeleteWidget={handleDeleteWidget}
              />
            ) : (
              <CreateTable
                key={widgetId}
                id={widgetId}
                {...widgetData}
                updatePosition={(id, x, y, width, height) => setWidgets(prev => ({
                  ...prev, [type]: prev[type].map(w => w[id] ? { [id]: { ...w[id], x, y, width, height } } : w)
                }))}
                handleDeleteWidget={handleDeleteWidget}
              />
            );
          })
        )}
      </div>
      {/* Table Headings Selection Modal */}
      <TableModal
        id={currentWidgetId}
        IsOpen={isOpen}
        setIsOpen={setIsOpen}
        handleHeadings={handleHeadings}
      />
    </div>
  );
}

export default Dashboard;
