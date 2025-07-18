import React, { useState, useEffect, useRef } from 'react';
import { ReplayableAnswerResponse, KeystrokeEvent } from '../types';
import RecordingsList from './RecordingsList';
import RecordingInfo from './RecordingInfo';
import ReplayDisplay from './ReplayDisplay';
import PlaybackControls from './PlaybackControls';
import ProgressSlider from './ProgressSlider';

const ReplayPageContent: React.FC = () => {
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
      console.log('Recordings data:', data);
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
      if (prevIndex >= selectedRecording.recording_data.length) {
        setIsPlaying(false);
        return prevIndex;
      }

      const event = selectedRecording.recording_data[prevIndex];
      
      if (event.key === 'input') {
        setCurrentText(event.value);
      }

      const newIndex = prevIndex + 1;
      
      if (newIndex < selectedRecording.recording_data.length) {
        const nextEvent = selectedRecording.recording_data[newIndex];
        const delay = (nextEvent.timestamp - event.timestamp) / playbackSpeed;
        timeoutRef.current = setTimeout(playNextEvent, Math.max(10, delay));
      } else {
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

  const getTotalDuration = () => {
    if (!selectedRecording || selectedRecording.recording_data.length === 0) return 0;
    return selectedRecording.recording_data[selectedRecording.recording_data.length - 1].timestamp;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Replay Page</h1>

      <RecordingsList
        recordings={recordings}
        selectedRecording={selectedRecording}
        onRecordingSelect={fetchRecordingDetails}
      />

      {selectedRecording && (
        <div>
          <RecordingInfo recording={selectedRecording} />
          
          <ReplayDisplay currentText={currentText} />

          <div style={{ marginBottom: '20px' }}>
            <PlaybackControls
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              onPlay={playRecording}
              onPause={pauseRecording}
              onReset={resetRecording}
              onSpeedChange={setPlaybackSpeed}
            />

            <ProgressSlider
              progress={getCurrentProgress()}
              onSeek={seekToPosition}
              totalDuration={getTotalDuration()}
              currentEventIndex={currentEventIndex}
              totalEvents={selectedRecording.recording_data.length}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplayPageContent;