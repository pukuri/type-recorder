import React from 'react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  playbackSpeed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  playbackSpeed,
  onPlay,
  onPause,
  onReset,
  onSpeedChange
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <button
        onClick={onPlay}
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
        onClick={onPause}
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
        onClick={onReset}
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
          onChange={(e) => onSpeedChange(Number(e.target.value))}
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
  );
};

export default PlaybackControls;