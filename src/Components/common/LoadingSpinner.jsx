import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
    const sizeClasses = {
        small: 'h-8 w-8',
        medium: 'h-12 w-12',
        large: 'h-16 w-16',
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}
            ></div>
            {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
