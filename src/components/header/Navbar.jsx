// src/components/Navbar.js
import React from 'react';
import Menu from './Menu';
import AttributeNav from './AttributeNav';

const Navbar = () => (
    <div className="menu_area alt-font">
        <nav className="navbar navbar-expand-lg navbar-light p-0">
            <div className="navbar-header navbar-header-custom">
                {/* start logo */}
                <a href="index.html" className="navbar-brand">
                    <img id="logo" src="img/logos/logo-inner.png" alt="logo" />
                </a>
                {/* end logo */}
            </div>
            <div className="navbar-toggler bg-primary"></div>
            {/* start menu area */}
            <Menu />
            {/* end menu area */}
            {/* start attribute navigation */}
            <AttributeNav />
            {/* end attribute navigation */}
        </nav>
    </div>
);

export default Navbar;
