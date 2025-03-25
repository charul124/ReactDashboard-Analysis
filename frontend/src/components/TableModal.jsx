import Modal from 'react-modal';
import PropTypes from 'prop-types';
import TableData from '../data/tableData.json';
import React, { useState, useEffect } from 'react';

function TableModal({ id, IsOpen, setIsOpen, handleHeadings }) {
    const [selectedHeadings, setSelectedHeadings] = useState([]);

    useEffect(() => {
        if (IsOpen) {
            console.log("Fetching headings...");
            const newHeadings = [];

            Object.values(TableData).forEach((row) => {
                Object.keys(row).forEach((key) => {
                    if (!newHeadings.includes(key)) {
                        newHeadings.push(key);
                    }
                });
            });

            setSelectedHeadings(newHeadings);
        }
    }, [IsOpen]);

    const handleHeadingChange = (event) => {
        const { name, checked } = event.target;
        setSelectedHeadings(prev =>
            checked ? [...prev, name] : prev.filter(heading => heading !== name)
        );
    };

    const handleSave = () => {
        console.log("Saving selected headings:", selectedHeadings);
        handleHeadings(id, selectedHeadings);
        closeModal();
    };

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <Modal className="w-1/2 absolute top-24 left-1/4 text-center bg-white shadow rounded p-10"
               isOpen={IsOpen} 
               onRequestClose={closeModal}>
            <h1 className='font-bold mb-3'>Select the columns you want to display</h1>
            {selectedHeadings?.map(element => (
                <div className='flex justify-between' key={element}> 
                    <label htmlFor={element}>{element}</label>
                    <input type="checkbox" name={element} checked={selectedHeadings.includes(element)}
                           onChange={handleHeadingChange} />
                </div>
            ))}
            <button className='bg-[#062F6F] hover:bg-[#5779E8] text-white rounded w-full p-1 mt-4' onClick={handleSave}>
                Save
            </button>
        </Modal>
    );
}

TableModal.propTypes = {
    id: PropTypes.string,
    IsOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    handleHeadings: PropTypes.func.isRequired,
};

export default TableModal;
