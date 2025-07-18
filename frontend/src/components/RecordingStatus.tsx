import React from 'react';

interface RecordingStatusProps {
  isRecording: boolean;
  recordingCount: number;
}

const RecordingStatus: React.FC<RecordingStatusProps> = ({ isRecording, recordingCount }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <p>Recording Status: {isRecording ? 'Recording...' : 'Not Recording'}</p>
      <p>Keystrokes Recorded: {recordingCount}</p>
    </div>
  );
};

export default RecordingStatus;