import React from 'react';
import { Typography, Box } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, value, onChange, onBlur, placeholder, error }) => {
  return (
    <Box mb={2}>
      <Typography variant="subtitle1" gutterBottom>{label}</Typography>
      <TextareaAutosize
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        minRows={3}
        style={{
          width: '100%',
          border: error ? '1px solid red' : '1px solid #ccc',
          borderRadius: '4px',
          padding: '8px',
          fontSize: '16px',
          boxSizing: 'border-box',
          fontFamily: 'Roboto, sans-serif',
        }}
      />
    </Box>
  );
};

export default TextAreaField;
