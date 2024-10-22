import React from 'react';

const ProgressBar = ({ score }) => {
  const progress = Math.min(score, 100); // Ensure it doesn't exceed 100
  return (
    <div className="mt-4">
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-center mt-1 text-gray-600"><strong>Score:</strong> {score}%</p>
    </div>
  );
};

export default ProgressBar;
