import React from 'react';

interface GeminiResponseProps {
    predictions: string;
}

const GeminiResponse: React.FC<GeminiResponseProps> = ({ predictions }) => {
    return (
        <div className="p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-bold mb-2">Your Predictions:</h2>
            <p className="text-gray-700">{predictions}</p>
        </div>
    );
};

export default GeminiResponse;