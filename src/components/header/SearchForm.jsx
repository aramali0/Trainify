// src/components/SearchForm.js
import React from 'react';

const SearchForm = () => (
    <div className="top-search bg-primary">
        <div className="container">
            <form className="search-form" action="search.html" method="GET" acceptCharset="utf-8">
                <div className="input-group">
                    <span className="input-group-addon cursor-pointer">
                        <button className="search-form_submit fas fa-search text-white" type="submit"></button>
                    </span>
                    <input
                        type="text"
                        className="search-form_input form-control"
                        name="s"
                        autoComplete="off"
                        placeholder="Type & hit enter..."
                    />
                    <span className="input-group-addon close-search mt-1">
                        <i className="fas fa-times"></i>
                    </span>
                </div>
            </form>
        </div>
    </div>
);

export default SearchForm;
