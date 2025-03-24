import React from 'react'
import chartImg from '../Images/ChartWid.jpg'
import tableImg from '../Images/Tablewid.png'
import PropTypes from 'prop-types';


function WidgetDrawer({name, type}) {
  return (
    <div className='m-5 rounded-md bg-blue-100 p-5' draggable="true" onDragStart={e => {console.log("Dragging started"); e.dataTransfer.setData('widgetType', type)}}>
        {type === "Chart" ? (
          <img className='bg-cover mb-3' src={chartImg} alt="Chart" />
        ) : type === "Table" ? (
          <img className='bg-cover mb-3' src={tableImg} alt="Table" />
        ) : null}
        <h2 className='text-[#062F6F] font-bold'>Create {name}</h2>
    </div>
  )
}

WidgetDrawer.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string
}

export default WidgetDrawer