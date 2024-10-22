import React from 'react';

const StatsCard = ({ iconClass, value, label, bgColor, textColor }) => {
    return (
        <div className="flex items-center gap-4 py-3">
            <div className="shrink">
                <div className={`h-14 w-14 inline-flex items-center justify-center ${bgColor} ${textColor} rounded-full`}>
                    <i className={iconClass}></i>
                </div>
            </div>
            <div className="grow">
                <h5 className="text-xl text-default-900 font-bold">{value}</h5>
                <p className="text-sm text-default-600">{label}</p>
            </div>
            <div className="shrink">
                <div className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-default-100 text-default-900 transition-all duration-200 hover:bg-default-900 hover:text-default-50">
                    <i className="ph-fill ph-arrow-right text-lg"></i>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
