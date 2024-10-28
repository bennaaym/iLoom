import { FC } from 'react';
import { Alert, AlertTitle, AlertProps } from '@mui/material';

interface IProps extends AlertProps {
  message: string;
}

const ErrorMessage: FC<IProps> = ({ message, ...rest }) => {
  return (
    <Alert severity="error" variant="outlined" {...rest} sx={{ borderRadius: 1 }}>
      <AlertTitle sx={{ fontSize: 14, fontWeight: 'bold' }}>{message}</AlertTitle>
    </Alert>
  );
};

export { ErrorMessage };
