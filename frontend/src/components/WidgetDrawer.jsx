import React from 'react'
import chartImg from '../Images/ChartWid.jpg'
import tableImg from '../Images/Tablewid.png'
import PropTypes from 'prop-types';


function WidgetDrawer({name, type}) {
  return (
    <div className='m-5 rounded-md bg-blue-100 p-3' draggable="true" onDragStart={e => {console.log("Dragging started"); e.dataTransfer.setData('widgetType', type)}}>
        {type === "Chart" ? (
          <img className='w-32 lg:w-48 mb-3' src={chartImg} alt="Chart" />
        ) : type === "Table" ? (
          <img className='w-32 lg:w-48 mb-3' src={tableImg} alt="Table" />
        ) : null}
        <h2 className='text-[#062F6F] md:text-sm sm:text-xs lg:text-lg font-bold'>Create {name}</h2>
    </div>
  )
}

WidgetDrawer.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string
}

export default WidgetDrawer