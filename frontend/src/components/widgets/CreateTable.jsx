import React, {useState} from 'react'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import PropTypes from 'prop-types';
import tableDataSource from "../../data/tableData.json"

function CreateTable({ id, x, y, width, height, updatePosition, handleDeleteWidget }) {
    
    const [sort, setSort] = useState({keytoSort: "", direction : "asc"})
    QueryClient.invalidateQueries({
        queryKey: ['tableDataSource'],
        exact: true,
      })
    const { data, isLoading } = useQuery({
        queryKey: ['tableDataSource'], 
        queryFn: () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(tableDataSource)
                }, 1000)})
            },
            staleTime: 3000
    })

    const mutation = useMutation({
        mutationFn: (newData) => {
            return new Promise((resolve) => {
            setTimeout(() => {
                resolve(newData)
            }, 1000)
            })
        }
    })

    if (isLoading) {
        return <div>Loading...</div>
    }
    console.log("React Query Data: ", data);
    const headers = ["Manufacturer", "SalesTime", "PartNumber", "TotalAmount", "PartName"];

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
    const filteredData = data.filter((data) =>
        Object.values(data).some((value) => value.toString().toLowerCase().includes(e.target.value.toLowerCase()))
    );
    mutation.mutate(filteredData);
    console.log("Found the data, the filtered data is", filteredData);
}

const handleHeaderClick = (header) => {
    setSort({
      keytoSort: header,
      direction: sort.direction === "asc" ? "desc" : "asc"
    })
    console.log("Clicked the header for sorting the column, the header is ", header);
  }
  const getSortedArray = (data) => {
    if(sort.direction === 'asc'){
      return data.sort((a,b)=>(a[sort.keytoSort] > b[sort.keytoSort] ? 1 : -1));
      
    }
    return data.sort((a,b)=>(a[sort.keytoSort] > b[sort.keytoSort] ? -1 : 1));
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
        <table>
            <thead>
                <tr>
                    {headers.map((heading) => (
                        <th key={heading} onClick={() => handleHeaderClick(heading)}>{heading}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {getSortedArray(data)?.map((row, index) => (
                    <tr key={index}>
                        {headers?.map((cell, cellIndex) => (
                            <td key={cellIndex}>
                                {cell === 'SalesTime' ? (
                                    new Date(row[cell] * 1000).toLocaleDateString('en-GB')
                                ) : (
                                    row[cell]
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

CreateTable.propTypes = {
  id: PropTypes.string, 
  x: PropTypes.number, 
  y: PropTypes.number, 
  width: PropTypes.number,
  height: PropTypes.number,
  headings: PropTypes.array,
  updatePosition : PropTypes.func, 
  handleDeleteWidget : PropTypes.func
};

export default CreateTable