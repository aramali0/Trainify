import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Use if you're using React Router for navigation
import logo from '../assets/ehc_logo.svg';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t } = useTranslation('header/header'); // Assuming you have translations for the header
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleSubMenuToggle = (menu) => {
        setOpenSubMenu(openSubMenu === menu ? null : menu);
    };

    return (
        <header className="p-0 m-0 header-style1 menu_area-light ">
            <div className="navbar-default border-bottom border-color-light-white">
                {/* Start Top Search */}
                <div className={`top-search bg-primary ${isSearchOpen ? 'open' : ''}`}>
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
                                    placeholder={t('searchPlaceholder')} // Translated placeholder
                                />
                                <span className="input-group-addon close-search mt-1" onClick={toggleSearch}>
                                    <i className="fas fa-times"></i>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 col-lg-12">
                            <div className="menu_area alt-font">
                                <nav className="navbar navbar-expand-lg navbar-light p-0">
                                    <div className="navbar-header navbar-header-custom">
                                        <Link to="/" className="navbar-brand">
                                            <img id="ehc"
                                            className='h-[150px] w-[150px]'
                                             src={logo} alt="logo" />
                                        </Link>
                                    </div>

                                    <div
                                        className={`navbar-toggler bg-primary ${isMenuOpen ? 'open' : ''}`}
                                        onClick={toggleMenu}
                                    >
                                    </div>

                                    <ul className={`navbar-nav ms-auto ${isMenuOpen ? 'd-block' : 'd-none d-lg-flex'}`} id="nav">
                                        <li><Link to="/">{t('home')}</Link></li>
                                        <li><Link to="/about">{t('about')}</Link></li>
                                        <li><Link to="/pricing">{t('pricing')}</Link></li>
                                        <li><Link to="/faq">{t('faq')}</Link></li>
                                    </ul>

                                    <div className="attr-nav align-items-xl-center ms-xl-auto main-font">
                                        <ul>
                                            <li className="d-none d-xl-inline-block">
                                                <Link to="/entreprises/responsable/add" className="butn md text-white">
                                                    <i className="fas fa-plus-circle icon-arrow before"></i>
                                                    <span className="label">{t('businessSpace')}</span> {/* Translated */}
                                                    <i className="fas fa-plus-circle icon-arrow after"></i>
                                                </Link>
                                            </li>
                                            <li className="d-none d-xl-inline-block">
                                                <Link to="/login" className="butn md text-green-400">
                                                    <i className="fas fa-plus-circle icon-arrow before"></i>
                                                    <span className="label">{t('login')}</span> {/* Translated */}
                                                    <i className="fas fa-plus-circle icon-arrow after"></i>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
