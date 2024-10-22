import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoDark from '../assets/images/logo-dark.png';
import logoLight from '../assets/images/logo-light.png';
import authBg1 from '../assets/images/other/auth-cardbg-1.png';
import authBg2 from '../assets/images/other/auth-cardbg-2.png';
import '../assets/css/Login.css'; // Reusing existing CSS for consistency

const ChooseRole = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const roles = location.state?.roles || [];

    const handleRoleSelection = (role) => {
        navigate(getDashboardPath(role));
    };

    const getDashboardPath = (role) => {
        switch (role) {
            case 'ROLE_ADMIN':
                return '/admin';
            case 'ROLE_FORMATEUR':
                return '/formateur';
            case 'ROLE_RESPONSABLE':
                return '/responsable';
            case 'ROLE_PARTICIPANT':
                return '/participant';
            default:
                return '/';
        }
    };



    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-card">
                    <div className="logo-container">
                        <img className="logo" src={logoDark} alt="Logo Dark" />
                        <img className="logo dark" src={logoLight} alt="Logo Light" />
                    </div>

                    <h4 className="login-title">Choose Your Role</h4>
                    <p className="login-subtitle">Select the role you want to proceed with</p>

                    <div className="role-selection">
                        {roles.map((role) => (
                            <div key={role} className="role-card" onClick={() => handleRoleSelection(role)}>
                                <h5 className="role-name">{role}</h5>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="background-images">
                    <img src={authBg1} alt="Auth Background 1" className="background-image bg1" />
                    <img src={authBg2} alt="Auth Background 2" className="background-image bg2" />
                </div>
            </div>
        </div>
    );
};

export default ChooseRole;

