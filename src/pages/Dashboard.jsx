import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ChartWidget from '../components/widgets/ChartWidget';
import TableWidget from '../components/widgets/TableWidget';
import WidgetDrawer from '../components/WidgetDrawer';
import TableModal from '../components/TableModal';
// import CreateTable from '../components/widgets/CreateTable';

function Dashboard() {
  const { path } = useParams();
  const [widgets, setWidgets] = useState([]);
  const [headings, setHeadings] = useState([]);
  const [IsOpen, setIsOpen] = useState(false);
  const [currentWidgetId, setCurrentWidgetId] = useState(null);

  //function to open the modal
  function openModal(id) {
      setCurrentWidgetId(id);
      setIsOpen(true);
  }

  //function to get the stored dashboard
  useEffect(() => {
    const storedDashboard = JSON.parse(localStorage.getItem(`dashboard_${path}`)) || [];
    setWidgets(storedDashboard);
  }, [path]);

  //function to receieve the new headings and update in widgets
  function handleHeadings(id, headers) {
    console.log("Received headings:", headers);
    setWidgets((prevWidgets) => prevWidgets.map((widget) => (widget.id === id ? {...widget, headings: headers} : widget)));
  }

  //function to handle drop and 
  const handleDrop = (e) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData('widgetType');
    if (!widgetType) return;
    let newWidget = {}
    if(widgetType == "Table"){
      const id = `widget_${Date.now()}`;
      newWidget = {
        id: id,
        type: widgetType,
        x: 350,
        y: 50,
        width: 500,
        height: 300,
        headings : headings,
      };
      openModal(id);
    }
    else if(widgetType == "Chart"){
      newWidget = {
        id: `widget_${Date.now()}`,
        type: widgetType,
        x: 350,
        y: 50,
        width: 500,
        height: 300,
        chartType: 'Bar',
        filters: { startDate: '2024-03-16', endDate: '2025-08-20' },
      }
    }
    
    setWidgets((prevWidgets) => Array.isArray(prevWidgets) ? [...prevWidgets, newWidget] : [newWidget]);
  };

  //function to update widget's position and dimension
  const updateWidgetPosition = (id, x, y, width, height) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) => (widget.id === id ? { ...widget, x, y, width, height } : widget))
    );
  };

  //function to update type of the chart
  const updateChartType = (id, chartType) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) => (widget.id === id ? { ...widget, chartType } : widget))
    );
  };

  //function to update start date and end date for the chart
  const updateFilters = (id, startDate, endDate) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === id ? { ...widget, filters: { startDate, endDate } } : widget
      )
    );
  };

  //function to delete widget
  const handleDeleteWidget = (id) => {
    setWidgets((prevWidgets) => prevWidgets.filter(widget => widget.id !== id));
  };

  //function to publish and store the data of the dashboard
  const handlePublishDashboard = () => {
    localStorage.setItem(`dashboard_${path}`, JSON.stringify(widgets));
    alert('Dashboard Published!');
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
        <Link to="/" onClick={handlePublishDashboard} className='bg-[#5779E8] mx-4 p-2 hover:bg-[#062F6F] text-white font-bold rounded mt-4'>
          Publish
        </Link>
      </div>

      {/* Main Dashboard Area */}
      <div className='w-4/5 text-center' onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        <h1 className='font-bold text-[#062F6F]'>YOUR DASHBOARD </h1>
        {Array.isArray(widgets) ? widgets.map((widget) => {
      if (widget.type === 'Chart') {
        return (
          <ChartWidget
          key={widget.id}
          id={widget.id}
          x={widget.x}
          y={widget.y}
          width={widget.width}
          height={widget.height}
          chartType={widget.chartType}
          updatePosition={updateWidgetPosition}
          updateChartType={updateChartType}
          updateFilters={updateFilters}
          savedFilters={widget.filters}
          handleDeleteWidget={handleDeleteWidget}
          />
        );
      } else if (widget.type === 'Table') {
        return (
          <TableWidget
          key={widget.id}
          id={widget.id}
          x={widget.x}
          y={widget.y}
          headings={widget.headings || ['Manufacturer']}
          width={widget.width}
          height={widget.height}
          updatePosition={updateWidgetPosition}
          handleDeleteWidget={handleDeleteWidget}
          />
        );
      }
      else{
        return null;
      }
    }) : <p>No widgets available</p>}
    <TableModal id={currentWidgetId} headings={headings} setHeadings={setHeadings} IsOpen={IsOpen} setIsOpen={setIsOpen} handleHeadings={handleHeadings} />
    <div>
      {/* <CreateTable /> */}
    </div>
      </div>
    </div>
  );
}

export default Dashboard;