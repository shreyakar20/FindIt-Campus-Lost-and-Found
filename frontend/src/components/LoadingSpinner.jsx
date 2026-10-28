import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading campus listings from MongoDB...' }) => {
  return (
    <div className="loading-container">
      <Loader2 size={36} className="spinner-icon" />
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
