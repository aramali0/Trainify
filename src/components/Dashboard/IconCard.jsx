import React from 'react';

const IconCard = ({ icon, iconColor, bgColor, title, linkText }) => {
    return (
        <div className="shadow rounded-lg bg-white dark:bg-default-50">
            <div className="p-2">
                <div className="flex items-center gap-2 rounded-md">
                    <div className={`h-15 w-15 inline-flex items-center justify-center ${bgColor} text-${iconColor} rounded`}>
                        <i className={`${icon} text-4xl`}></i>
                    </div>
                    <div>
                        <h6 className="text-base font-medium text-default-900 line-clamp-1">{title}</h6>
                        <a href="#" className="text-xs text-default-500">{linkText} <i className="ph-fill ph-arrow-right align-middle"></i></a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IconCard;
