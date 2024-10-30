import React from 'react';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

interface BaseSubmitButtonProps {
  label: string;
  isLoading: boolean;
}

const BaseSubmitButton: React.FC<BaseSubmitButtonProps> = ({ label, isLoading }) => {
  return (
    <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
      {isLoading ? <CircularProgress size={24} /> : label}
    </Button>
  );
};

export default BaseSubmitButton;
