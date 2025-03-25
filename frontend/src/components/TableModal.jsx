import Modal from 'react-modal';
import PropTypes from 'prop-types';
import TableData from '../data/tableData.json';
import React, { useState, useEffect } from 'react';


function TableModal({ id, setHeadings, IsOpen, setIsOpen, handleHeadings }) {
    // State to store selected table headings
    const [selectedHeadings, setSelectedHeadings] = useState([]);

    useEffect(() => {
        // Extract and store all unique headings from TableData when the modal opens
        console.log("The headings are being stored");
        const newHeadings = [];

        Object.values(TableData).forEach((row) => {
            Object.keys(row).forEach((key) => {
                if (!newHeadings.includes(key)) {
                    newHeadings.push(key);
                }
            });
        });

        console.log("The new Headings are : ", newHeadings);
        setSelectedHeadings(newHeadings);
    }, [IsOpen]); // Runs whenever modal visibility changes

    const handleHeadingChange = (event) => {
        const { name, checked } = event.target;

        // Update selectedHeadings state based on checkbox status
        setSelectedHeadings(prevState => 
            checked ? [...prevState, name] : prevState.filter(heading => heading !== name)
        );
    };

    //Saves the selected headings and updates parent state.
    const handleSave = () => {
        setHeadings(selectedHeadings);
        console.log("Selected headings are : ", selectedHeadings);
        handleHeadings(id, selectedHeadings); // Call parent function to store selection
        closeModal();
    };

    //Closes the modal.
    function closeModal() {
        setIsOpen(false);
    }

    // Modal styles to provide overlay effect
    const modalStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
    };
    
    return (
        <div>
            <Modal
                className="w-1/2 absolute top-24 left-1/4 text-center bg-white shadow rounded p-10"
                isOpen={IsOpen}
                style={modalStyles}
                onRequestClose={closeModal}>
                
                {/* Modal Header */}
                <h1 className='font-bold mb-3'>Select the columns you want to display</h1>
                
                {/* Render checkboxes for each heading */}
                {selectedHeadings?.map(element => (
                    <div className='flex justify-between' key={element}> 
                        <label htmlFor={element}>{element}</label>
                        <input 
                            onChange={handleHeadingChange} 
                            type="checkbox" 
                            name={element} 
                            checked={selectedHeadings.includes(element)}
                        />
                    </div>
                ))}
                
                {/* Save button to confirm selected headings */}
                <button className='bg-[#062F6F] hover:bg-[#5779E8] text-white rounded w-full p-1 mt-4' onClick={handleSave}>
                    Save
                </button>
            </Modal>
        </div>
    );
}

// Define prop types for type safety
TableModal.propTypes = {
    id: PropTypes.string.isRequired,
    headings: PropTypes.array, 
    IsOpen: PropTypes.bool,
    setIsOpen: PropTypes.func, 
    setHeadings: PropTypes.func, 
    handleHeadings: PropTypes.func,
};

export default TableModal;
