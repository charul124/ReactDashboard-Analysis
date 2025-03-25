import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import chartDataSource from '../../data/chartData.json';
import PropTypes from 'prop-types';

Chart.defaults.maintainAspectRatio = false;
Chart.defaults.responsive = true;

Chart.register(...registerables); 
const typeOfChart = { Bar: Bar, Line: Line, Pie: Pie };

function ChartWidget({ id, x, y, width, height, chartType, updatePosition, updateChartType, updateFilters, savedFilters, handleDeleteWidget}) {
  
  console.log("The saved filters are :",savedFilters);
  
  const [startDate, setStartDate] = useState(savedFilters?.startDate || "");
  const [endDate, setEndDate] = useState(savedFilters?.endDate || "");
  const [filteredData, setFilteredData] = useState(chartDataSource); 
    
  const chartRef = useRef(null);
  console.log("start date and end date are", startDate, endDate);
  

  //to cleanup previous chart
  useEffect(() => {
    const currentChartRef = chartRef.current;
    return () => {
      if (currentChartRef) {
        console.log({chartRef});
        currentChartRef.destroy();
        console.log("The previous reference has been destroyed");
      }
    };
  }, [chartType]);


  //function to filter data based on startdate and enddate
    const filterData = useCallback((start, end) => {
    const startD = new Date(start);
    const endD = new Date(end);
    const filtered = chartDataSource.filter((data) => {
      const dataDate = new Date(data.SellingTime * 1000);
      return dataDate >= startD && dataDate <= endD;
    });
    setFilteredData(filtered);
    updateFilters(id, start, end);
  }, [id, updateFilters]);

  //to pass the startDate and endDate everytime when it is changed
  useEffect(() => {
    if (startDate && endDate) {
      filterData(startDate, endDate);
    }
  }, [startDate, endDate]);

  //function for updating the position of the chart
  const handleDragEnd = (e) => {
    updatePosition(id, e.clientX, e.clientY, width ,height);
  };

  //function for updating the dimensions of the widget
    const handleResize = (e) => {
    const newWidth = parseFloat(e.target.style.width) || width;
    const newHeight = parseFloat(e.target.style.height) || height;
    updatePosition(id, x, y, newWidth, newHeight);
  };


  //function to set the startdate and enddate
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") setStartDate(value);
    if (name === "endDate") setEndDate(value);
  };

  //function to update the chart type
  const handleChartTypeChange = (e) => {
    const newChartType = e.target.value;
    updateChartType(id, newChartType);
  };

  //for dynamic chart type COMPONENT
  const ChartComponent = typeOfChart[chartType] || Bar;

  return (
    <div
      className='absolute shadow-md p-4 pb-10 rounded-md resize overflow-auto bg-white'
      style={{ width: width, height: height, top: `${y}px`, left: `${x}px` }}
      draggable='true'
      onDragEnd={handleDragEnd}
      onClick={handleResize}
    >
      <div className='flex justify-between'>
        <div className='flex'>
            {/* date inputs */}
            <div>
              <input className='border rounded px-1 border-gray-400 m-1' type="date" name="startDate" value={startDate} onChange={handleDateChange} />
              <input className='border rounded px-1 border-gray-400 m-1' type="date" name="endDate" value={endDate} onChange={handleDateChange} />
            </div>
            {/* chart type dropdown */}
            <select className='border rounded border-gray-400 m-1' value={chartType} onChange={handleChartTypeChange}>
              {Object.keys(typeOfChart).map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
        </div>
        {/* Delete Button */}
        <button
          className="text-sm bg-[#D5074D] px-1 m-2 text-white rounded"
          onClick={() => handleDeleteWidget(id)}
        >
          x
        </button>
      </div>

      <ChartComponent
        ref={chartRef}
        data={{
          labels: filteredData.map((data) => new Date(data.SellingTime * 1000).toISOString().split('T')[0]),
          datasets: [
            {
              label: 'Number of Parts Sold',
              data: filteredData.map((data) => data.PartsSold),
              backgroundColor: ['#D0DBF8'],
              borderColor: ['#062F6F'],
              borderWidth: 1
            },
          ],
        }}
      />
    </div>
  );
}

ChartWidget.propTypes = {
    id: PropTypes.string,
    x: PropTypes.number, 
    y: PropTypes.number, 
    width: PropTypes.number, 
    height: PropTypes.number, 
    chartType :PropTypes.string, 
    updatePosition : PropTypes.func, 
    updateChartType : PropTypes.func, 
    updateFilters : PropTypes.func, 
    savedFilters : PropTypes.func, 
    handleDeleteWidget : PropTypes.func
};

export default ChartWidget;
