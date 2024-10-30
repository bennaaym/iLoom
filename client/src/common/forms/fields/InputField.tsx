import React from 'react';
import { TextField, Box, Typography } from '@mui/material';

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, value, onChange, onBlur, placeholder, error }) => {
  return (
    <Box mb={2}>
      <Typography variant="subtitle1" gutterBottom>{label}</Typography>
      <TextField
        id={id}
        fullWidth
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        variant="outlined"
        error={error}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
          },
        }}
      />
    </Box>
  );
};

export default InputField;
