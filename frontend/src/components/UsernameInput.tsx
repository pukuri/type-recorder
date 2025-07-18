import React from 'react';

interface UsernameInputProps {
  username: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const UsernameInput: React.FC<UsernameInputProps> = ({ username, onChange, disabled }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
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
  );
};

export default UsernameInput;