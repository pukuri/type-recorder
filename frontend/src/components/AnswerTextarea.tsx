import React from 'react';

interface AnswerTextareaProps {
  answer: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
}

const AnswerTextarea: React.FC<AnswerTextareaProps> = ({ 
  answer, 
  onChange, 
  onKeyDown, 
  onKeyUp, 
  disabled 
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="answer">Your Answer:</label>
      <textarea
        id="answer"
        value={answer}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        disabled={disabled}
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
  );
};

export default AnswerTextarea;