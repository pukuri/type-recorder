import React from 'react';

interface ReplayDisplayProps {
  currentText: string;
}

const ReplayDisplay: React.FC<ReplayDisplayProps> = ({ currentText }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        style={{
          width: '100%',
          height: '200px',
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#f8f9fa',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowY: 'auto',
          fontFamily: 'monospace'
        }}
      >
        {currentText || 'Replay will appear here...'}
      </div>
    </div>
  );
};

export default ReplayDisplay;