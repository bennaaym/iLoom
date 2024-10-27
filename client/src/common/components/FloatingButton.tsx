import { Box, BoxProps, Fab } from "@mui/material";

interface Props extends BoxProps {
  icon: React.ReactNode;
}

export const FloatingButton = ({ icon, ...props }: Props) => {
  return (
    <Box {...props} sx={{ "& > :not(style)": { m: 1 } }}>
      <Fab color="primary" aria-label="add">
        {icon}
      </Fab>
    </Box>
  );
};
