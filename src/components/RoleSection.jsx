import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoDark from '../assets/ehc_logo.svg';
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
            case 'ROLE_CHARGE':
                return '/charge-formation';
            default:
                return '/';
        }
    };



    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-card">
                    <div className="logo-container">
                        <img className="h-20 w-20"
                        height={70}
                        width={70}
                         src={logoDark} alt="Logo Dark" />
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
            </div>
        </div>
    );
};

export default ChooseRole;

