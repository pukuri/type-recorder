import React from 'react';
import { Question } from '../types';

interface SubmitControlsProps {
  selectedQuestion: Question | null;
  username: string;
  answer: string;
  isSubmitted: boolean;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

const SubmitControls: React.FC<SubmitControlsProps> = ({
  selectedQuestion,
  username,
  answer,
  isSubmitted,
  isLoading,
  onSubmit,
  onReset
}) => {
  return (
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
          onClick={onReset}
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
  );
};

export default SubmitControls;