import React, { useState } from 'react';
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import tableDataSource from "../../data/tableData.json";

function CreateTable({ id, x, y, headings, width, height, updatePosition, handleDeleteWidget }) {
  const [sort, setSort] = useState({ keytoSort: "", direction: "asc" });
  const [searchFilter, setSearchFilter] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ['tableDataSource'],
    queryFn: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(tableDataSource);
        }, 1000);
      });
    },
    staleTime: 3000
  });
  
//function for updating all the data coming from the widget
  const handleUpdatePosition = (id, x, y, width, height) => {
    updatePosition(id, x, y, width, height);
  };

  //function for updating the position of the widget
  const handleDragEnd = (e) => {
    handleUpdatePosition(id, e.clientX, e.clientY, width, height);
  };

  //function for updating the dimensions of the widget
  const handleResize = (e) => {
    const newWidth = parseFloat(e.target.style.width) || width;
    const newHeight = parseFloat(e.target.style.height) || height;
    handleUpdatePosition(id, x, y, newWidth, newHeight);
  };

  //function for search filter
  const handleSearchFilter = (e) => {
    setSearchFilter(e.target.value);
  };
  const filteredData = data?.filter((row) => {
    return Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  //functionality for sorting the column in asc or desc order
  const handleHeaderClick = (header) => {
    setSort({
      keytoSort: header,
      direction: sort.direction === "asc" ? "desc" : "asc"
    });
  };
  const getSortedArray = (data) => {
    if (sort.direction === 'asc') {
      return data.sort((a, b) => (a[sort.keytoSort] > b[sort.keytoSort] ? 1 : -1));
    }
    return data.sort((a, b) => (a[sort.keytoSort] > b[sort.keytoSort] ? -1 : 1));
  };

  //when the data is loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const headers = headings;

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
        {/* Search input */}
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
          <tr>
            {headers.map((heading) => (
              <th key={heading} onClick={() => handleHeaderClick(heading)} className='border p-1 hover:bg-[#D0DBF8] active:bg-[#aac0ff]'>
                <div className='flex gap-2 justify-center'>
                  {heading}<HiMiniArrowsUpDown className='mt-1'/> 
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getSortedArray(searchFilter ? filteredData : data)?.map((row, index) => (
            <tr key={index} className='border'>
              {headers?.map((cell, cellIndex) => (
                <td key={cellIndex} className='border px-2 py-1'>
                  {cell === 'SalesTime' ? (
                    <div className='flex gap-2 justify-center'>
                    {new Date(row[cell] * 1000).toLocaleDateString('en-GB')}
                  </div>
                  ) : (
                    row[cell] || ""
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

CreateTable.propTypes = {
  id: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  updatePosition: PropTypes.func,
  handleDeleteWidget: PropTypes.func
};

export default CreateTable;
