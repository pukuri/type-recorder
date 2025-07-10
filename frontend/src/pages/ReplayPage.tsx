import React, { useState, useEffect, useRef } from 'react';
import { ReplayableAnswerResponse, KeystrokeEvent } from '../types';

const ReplayPage: React.FC = () => {
  const [recordings, setRecordings] = useState<ReplayableAnswerResponse[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<ReplayableAnswerResponse | null>(null);
  const [currentText, setCurrentText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.33);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/replayable_answers`);
      const data = await response.json();
      console.log('Recordings data:', data); // Debug log
      setRecordings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      setRecordings([]);
    }
  };

  const fetchRecordingDetails = async (uuid: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/replayable_answers/${uuid}`);
      const data = await response.json();
      setSelectedRecording(data);
      setCurrentText('');
      setCurrentEventIndex(0);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error fetching recording details:', error);
    }
  };

  const playRecording = () => {
    if (!selectedRecording || isPlaying) return;
    
    setIsPlaying(true);
    playNextEvent();
  };

  const playNextEvent = () => {
    if (!selectedRecording) {
      setIsPlaying(false);
      return;
    }

    setCurrentEventIndex(prevIndex => {
      // Check if we've reached the end
      if (prevIndex >= selectedRecording.recording_data.length) {
        setIsPlaying(false);
        return prevIndex;
      }

      const event = selectedRecording.recording_data[prevIndex];
      
      // Update text for any input event
      if (event.key === 'input') {
        setCurrentText(event.value);
      }

      const newIndex = prevIndex + 1;
      
      // Check if there's a next event and we haven't reached the end
      if (newIndex < selectedRecording.recording_data.length) {
        const nextEvent = selectedRecording.recording_data[newIndex];
        const delay = (nextEvent.timestamp - event.timestamp) / playbackSpeed;
        timeoutRef.current = setTimeout(playNextEvent, Math.max(10, delay));
      } else {
        // We've reached the end
        setIsPlaying(false);
      }
      
      return newIndex;
    });
  };

  const pauseRecording = () => {
    setIsPlaying(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const resetRecording = () => {
    setIsPlaying(false);
    setCurrentEventIndex(0);
    setCurrentText('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const seekToPosition = (position: number) => {
    if (!selectedRecording) return;
    
    pauseRecording();
    
    const targetIndex = Math.floor(position * selectedRecording.recording_data.length);
    setCurrentEventIndex(targetIndex);
    
    // Replay events up to the target position to get the correct text state
    let text = '';
    for (let i = 0; i < targetIndex; i++) {
      const event = selectedRecording.recording_data[i];
      if (event.key === 'input') {
        text = event.value;
      }
    }
    setCurrentText(text);
  };

  const getCurrentProgress = () => {
    if (!selectedRecording || selectedRecording.recording_data.length === 0) return 0;
    return currentEventIndex / selectedRecording.recording_data.length;
  };

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor(timestamp / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    if (!selectedRecording || selectedRecording.recording_data.length === 0) return 0;
    return selectedRecording.recording_data[selectedRecording.recording_data.length - 1].timestamp;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Replay Page</h1>

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
              onClick={() => fetchRecordingDetails(recording.uuid)}
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

      {selectedRecording && (
        <div>
          <h2>Replaying: {selectedRecording.username}'s answer</h2>
          <p><strong>Question:</strong> {selectedRecording.question}</p>
          <p><strong>UUID:</strong> {selectedRecording.uuid}</p>
          
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

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <button
                onClick={playRecording}
                disabled={isPlaying}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: isPlaying ? 'default' : 'pointer'
                }}
              >
                {isPlaying ? 'Playing...' : 'Play'}
              </button>

              <button
                onClick={pauseRecording}
                disabled={!isPlaying}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: '#ffc107',
                  color: 'black',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: !isPlaying ? 'default' : 'pointer'
                }}
              >
                Pause
              </button>

              <button
                onClick={resetRecording}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>

              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                Speed:
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  style={{ padding: '4px' }}
                >
                  <option value={0.1}>0.1x</option>
                  <option value={0.33}>0.33x</option>
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px' }}>0:00</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={getCurrentProgress()}
                onChange={(e) => seekToPosition(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '12px' }}>
                {formatTime(getTotalDuration())}
              </span>
            </div>

            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              Progress: {Math.round(getCurrentProgress() * 100)}% 
              ({currentEventIndex}/{selectedRecording.recording_data.length} events)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplayPage;