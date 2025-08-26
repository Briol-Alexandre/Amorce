import React from 'react';

/**
 * 
 * @param {Object} props 
 * @param {string} props.title 
 * @param {string} props.className 
 * @param {React.ReactNode} props.children 
 * @param {string} props.icon 
 * @param {string} props.color 
 * @returns {JSX.Element}
 */
export default function Widget({ title, className = '', children, icon = null, color = 'default' }) {
    const colorClasses = {
        default: 'bg-white border-gray-200',
        primary: 'bg-white border-gray-200',
        success: 'bg-white border-gray-200',
        warning: 'bg-white border-gray-200',
        danger: 'bg-white border-gray-200',
        purple: 'bg-white border-gray-200',
        '': 'bg-white border-gray-200'
    };

    const titleColorClasses = {
        default: 'text-gray-700',
        primary: 'text-gray-700',
        success: 'text-gray-700',
        warning: 'text-gray-700',
        danger: 'text-gray-700',
        purple: 'text-gray-700',
        '': 'text-gray-700'
    };

    return (
        <div className={`rounded-lg shadow-sm border p-4 ${colorClasses[color]} ${className}`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className={`font-semibold text-lg ${titleColorClasses[color]} flex items-center justify-center`}>
                    {icon && <span className="mr-2">{icon}</span>}
                    {title}
                </h3>
            </div>
            <div className="widget-content">
                {children}
            </div>
        </div>
    );
}
