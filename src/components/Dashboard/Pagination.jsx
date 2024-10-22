import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-6 py-3 px-6 border-t border-dashed border-default-200">
            <h6 className="text-default-600">Showing {currentPage} of {totalPages}</h6>
            <nav className="flex items-center gap-1">
                <button
                    className="inline-flex items-center justify-center h-8 w-8 border border-default-200 rounded-md text-default-950 transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <i className="ph ph-caret-left text-base"></i>
                </button>
                {/* Add logic to render page numbers dynamically */}
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        className={`inline-flex items-center justify-center h-8 w-8 border rounded-md transition-all duration-200 ${currentPage === index + 1 ? 'bg-primary text-white border-primary' : 'border-default-200 text-default-950 hover:bg-primary hover:text-white hover:border-primary'}`}
                        onClick={() => onPageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="inline-flex items-center justify-center h-8 w-8 border border-default-200 rounded-md text-default-950 transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <i className="ph ph-caret-right text-base"></i>
                </button>
            </nav>
        </div>
    );
};

export default Pagination;
