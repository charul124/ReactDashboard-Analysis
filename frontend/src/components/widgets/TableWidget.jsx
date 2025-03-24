import React, { useState } from 'react';
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import PropTypes from 'prop-types';
import tableDataSource from '../../data/tableData.json';

function TableWidget({ id, x, y, headings, width, height, updatePosition, handleDeleteWidget }) {
const [tableData, setTableData] = useState(tableDataSource);
const [sort, setSort] = useState({keytoSort: "", direction : "asc"})

console.log("The table headings are : ", headings);
const headers = headings;

//function for updating all the data coming from the widget
const handleUpdatePosition = (id, x, y, width, height) => {
  console.log("Finally updating the data to be stored");
  updatePosition(id, x, y, width, height);
}

//function for updating the position of the widget
const handleDragEnd = (e) => {
  console.log("The x and y positions are now updated", e.clientX, e.clientY);
  handleUpdatePosition(id, e.clientX, e.clientY, width ,height);
};

//function for updating the dimensions of the widget
const handleResize = (e) => {
  const newWidth = parseFloat(e.target.style.width) || width;
  const newHeight = parseFloat(e.target.style.height) || height;
  console.log("the height and widht are now updated", newWidth, newHeight);
  handleUpdatePosition(id, x, y, newWidth, newHeight);
}


//function for search filter
const handleSearchFilter = (e) => {
    const filteredData = tableDataSource.filter((data) =>
        Object.values(data).some((value) => value.toString().toLowerCase().includes(e.target.value.toLowerCase()))
    );
    setTableData(filteredData);
    console.log("Found the data, the filtered data is", filteredData);
}

//functionality for sorting the column in asc or desc order
const handleHeaderClick = (header) => {
  setSort({
    keytoSort: header,
    direction: sort.direction === "asc" ? "desc" : "asc"
  })
  console.log("Clicked the header for sorting the column, the header is ", header);
}
const getSortedArray = (tableData) => {
  if(sort.direction === 'asc'){
    return tableData.sort((a,b)=>(a[sort.keytoSort] > b[sort.keytoSort] ? 1 : -1));
    
  }
  return tableData.sort((a,b)=>(a[sort.keytoSort] > b[sort.keytoSort] ? -1 : 1));
}

return (
  <div
    className='absolute shadow-md p-3 rounded-md overflow-auto bg-white resize'
    style={{
      width: width,
      height: height,
      top: `${y}px`,
      left: `${x}px`,
    }}
    draggable='true'
    onDragEnd={handleDragEnd}
    onClick={handleResize}
  >
    <div className='flex gap-2 justify-between'>
      {/* text input */}
      <input
        type='text'
        placeholder='Search...'
        className='border rounded-md px-2 my-2 w-full border-gray-500'
        onChange={handleSearchFilter}
      />

      {/* Delete Button */}
      <button
        className="text-sm bg-[#D5074D] text-white px-1 my-3 rounded"
        onClick={() => handleDeleteWidget(id)}>x</button>
    </div>
    <table className='w-full border'>

    {/* populating all the headings */}
    <thead>
      <tr className=''>
      {headers.map((key, index) => {
        return (
        <th key={index} onClick={() => handleHeaderClick(key)} className='border p-1 hover:bg-[#D0DBF8] active:bg-[#aac0ff]'>
          <div className='flex gap-2 justify-center'>
          {key}<HiMiniArrowsUpDown className='mt-1'/> 
          </div>
        </th>
        )
      })}
      </tr>
    </thead>

    <tbody>
      {
      getSortedArray(tableData).map((row, index) => (
        <tr key={index} className='border'>
          {headers.map((heading, idx) => (
            <td key={idx} className='border px-2 py-1'>
              {heading === 'SalesTime' ? (
                <div className='flex gap-2 justify-center'>
                  {new Date(row[heading] * 1000).toLocaleDateString('en-GB')}
                </div>
              ) : (
                row[heading] || ''
              )}
            </td>
          ))}
        </tr>
      ))
      }
    </tbody>
    </table>
  </div>
);
}

TableWidget.propTypes = {
  id: PropTypes.string, 
  x: PropTypes.number, 
  y: PropTypes.number, 
  width: PropTypes.number,
  height: PropTypes.number,
  headings: PropTypes.array,
  updatePosition : PropTypes.func, 
  handleDeleteWidget : PropTypes.func
};

export default TableWidget;


