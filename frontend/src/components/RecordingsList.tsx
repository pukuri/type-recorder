import React from 'react';
import { ReplayableAnswerResponse } from '../types';

interface RecordingsListProps {
  recordings: ReplayableAnswerResponse[];
  selectedRecording: ReplayableAnswerResponse | null;
  onRecordingSelect: (uuid: string) => void;
}

const RecordingsList: React.FC<RecordingsListProps> = ({ 
  recordings, 
  selectedRecording, 
  onRecordingSelect 
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Available Recordings:</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {recordings && recordings.length > 0 ? recordings.map((recording) => (
          <div
            key={recording.uuid}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              cursor: 'pointer',
              backgroundColor: selectedRecording?.uuid === recording.uuid ? '#e3f2fd' : '#f9f9f9'
            }}
            onClick={() => onRecordingSelect(recording.uuid)}
          >
            <strong>{recording.username}</strong>
            <br />
            <small>UUID: {recording.uuid}</small>
            <br />
            <small>Created: {new Date(recording.created_at).toLocaleString()}</small>
          </div>
        )) : (
          <p>No recordings available yet. Go to the Write page to create some!</p>
        )}
      </div>
    </div>
  );
};

export default RecordingsList;