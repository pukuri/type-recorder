import { useState, useCallback, useRef } from 'react';
import { KeystrokeEvent } from '../types';

export const useKeystrokeRecorder = () => {
  const [recording, setRecording] = useState<KeystrokeEvent[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecording([]);
    startTimeRef.current = Date.now();
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    startTimeRef.current = null;
  }, []);

  const recordKeystroke = useCallback((
    type: 'keydown' | 'keyup',
    key: string,
    value: string
  ) => {
    if (!isRecording || !startTimeRef.current) return;

    const timestamp = Date.now() - startTimeRef.current;
    const event: KeystrokeEvent = {
      type,
      key,
      timestamp,
      value
    };

    setRecording(prev => [...prev, event]);
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    setRecording([]);
    startTimeRef.current = null;
  }, []);

  return {
    recording,
    isRecording,
    startRecording,
    stopRecording,
    recordKeystroke,
    clearRecording
  };
};