import React from 'react';
import { ReplayableAnswerResponse } from '../types';

interface RecordingInfoProps {
  recording: ReplayableAnswerResponse;
}

const RecordingInfo: React.FC<RecordingInfoProps> = ({ recording }) => {
  return (
    <div>
      <h2>Replaying: {recording.username}'s answer</h2>
      <p><strong>Question:</strong> {recording.question}</p>
      <p><strong>UUID:</strong> {recording.uuid}</p>
    </div>
  );
};

export default RecordingInfo;