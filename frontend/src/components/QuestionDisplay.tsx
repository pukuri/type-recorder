import React from 'react';
import { Question } from '../types';

interface QuestionDisplayProps {
  question: Question;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Question:</h2>
      <p style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        padding: '10px', 
        backgroundColor: '#f5f5f5',
        borderRadius: '5px'
      }}>
        {question.content}
      </p>
    </div>
  );
};

export default QuestionDisplay;