import React from 'react';

interface ProgressSliderProps {
  progress: number;
  onSeek: (position: number) => void;
  totalDuration: number;
  currentEventIndex: number;
  totalEvents: number;
}

const ProgressSlider: React.FC<ProgressSliderProps> = ({
  progress,
  onSeek,
  totalDuration,
  currentEventIndex,
  totalEvents
}) => {
  const formatTime = (timestamp: number) => {
    const seconds = Math.floor(timestamp / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '12px' }}>0:00</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={progress}
          onChange={(e) => onSeek(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: '12px' }}>
          {formatTime(totalDuration)}
        </span>
      </div>

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Progress: {Math.round(progress * 100)}% 
        ({currentEventIndex}/{totalEvents} events)
      </div>
    </div>
  );
};

export default ProgressSlider;