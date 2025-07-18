import React, { useState, useEffect, useCallback } from 'react';
import { useKeystrokeRecorder } from '../hooks/useKeystrokeRecorder';
import { Question, ReplayableAnswer } from '../types';
import QuestionDisplay from './QuestionDisplay';
import UsernameInput from './UsernameInput';
import AnswerTextarea from './AnswerTextarea';
import RecordingStatus from './RecordingStatus';
import SubmitControls from './SubmitControls';

const WritePageContent: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [username, setUsername] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    recording,
    isRecording,
    startRecording,
    stopRecording,
    recordKeystroke,
    clearRecording
  } = useKeystrokeRecorder();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/questions`);
      const data = await response.json();
      setQuestions(data);
      if (data.length > 0) {
        setSelectedQuestion(data[0]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswerChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isSubmitted) return;
    
    const value = e.target.value;
    setAnswer(value);
    
    if (!isRecording && value.length === 1) {
      startRecording();
    }
    
    recordKeystroke('keydown', 'input', value);
  }, [isSubmitted, isRecording, startRecording, recordKeystroke]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isSubmitted) return;
    recordKeystroke('keydown', e.key, answer);
  }, [isSubmitted, recordKeystroke, answer]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isSubmitted) return;
    recordKeystroke('keyup', e.key, answer);
  }, [isSubmitted, recordKeystroke, answer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !username.trim() || !answer.trim()) return;

    setIsLoading(true);
    stopRecording();

    try {
      const replayableAnswer: ReplayableAnswer = {
        username: username.trim(),
        question_id: selectedQuestion.id,
        recording_data: recording
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/replayable_answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ replayable_answer: replayableAnswer })
      });

      if (response.ok) {
        setIsSubmitted(true);
        alert('Answer submitted successfully!');
      } else {
        alert('Error submitting answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Error submitting answer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnswer('');
    setUsername('');
    setIsSubmitted(false);
    clearRecording();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Write Page</h1>
      
      {selectedQuestion && (
        <QuestionDisplay question={selectedQuestion} />
      )}

      <form onSubmit={handleSubmit}>
        <UsernameInput
          username={username}
          onChange={setUsername}
          disabled={isSubmitted}
        />

        <AnswerTextarea
          answer={answer}
          onChange={handleAnswerChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          disabled={isSubmitted}
        />

        <RecordingStatus
          isRecording={isRecording}
          recordingCount={recording.length}
        />

        <SubmitControls
          selectedQuestion={selectedQuestion}
          username={username}
          answer={answer}
          isSubmitted={isSubmitted}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
      </form>
    </div>
  );
};

export default WritePageContent;