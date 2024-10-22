import React from 'react';

const SearchBar = ({ onAdd }) => {
    return (
        <div className="shadow rounded-lg bg-white dark:bg-default-50">
            <div className="flex flex-wrap items-center justify-between py-4 px-5">
                <div className="relative">
                    <input type="search" className="ps-10 pe-4 py-2.5 block lg:w-64 border-none bg-default-100 text-default-700 rounded-lg text-sm focus:border-primary focus:ring-primary" placeholder="Search for items..." />
                    <span className="ph ph-magnifying-glass text-xl z-10 absolute start-3 top-1/2 -translate-y-1/2"></span>
                </div>
                <button onClick={onAdd} className="py-2 px-5 inline-flex items-center justify-center font-semibold tracking-wide align-middle duration-500 text-sm text-center bg-primary hover:bg-primary-500 text-white rounded">
                    <i className="ph ph-plus-circle text-lg/none me-3"></i> Add Customers
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
