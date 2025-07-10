import React, { useState, useEffect, useCallback } from 'react';
import { useKeystrokeRecorder } from '../hooks/useKeystrokeRecorder';
import { Question, ReplayableAnswer } from '../types';

const WritePage: React.FC = () => {
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
        <div style={{ marginBottom: '20px' }}>
          <h2>Question:</h2>
          <p style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            padding: '10px', 
            backgroundColor: '#f5f5f5',
            borderRadius: '5px'
          }}>
            {selectedQuestion.content}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitted}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
            placeholder="Enter your username"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="answer">Your Answer:</label>
          <textarea
            id="answer"
            value={answer}
            onChange={handleAnswerChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            disabled={isSubmitted}
            style={{
              width: '100%',
              height: '200px',
              padding: '10px',
              fontSize: '16px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              resize: 'vertical'
            }}
            placeholder="Start typing your answer..."
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p>Recording Status: {isRecording ? 'Recording...' : 'Not Recording'}</p>
          <p>Keystrokes Recorded: {recording.length}</p>
        </div>

        <div>
          <button
            type="submit"
            disabled={!selectedQuestion || !username.trim() || !answer.trim() || isSubmitted || isLoading}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: isSubmitted ? '#28a745' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isSubmitted ? 'default' : 'pointer',
              marginRight: '10px'
            }}
          >
            {isLoading ? 'Submitting...' : isSubmitted ? 'Submitted' : 'Submit Answer'}
          </button>

          {isSubmitted && (
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default WritePage;