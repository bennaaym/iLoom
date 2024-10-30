import { Box, BoxProps, Fab } from "@mui/material";

interface Props extends BoxProps {
  icon: React.ReactNode;
}

export const FloatingButton = ({
  icon,
  bgcolor = "primary",
  ...props
}: Props) => {
  return (
    <Box {...props} sx={{ "& > :not(style)": { m: 1 } }}>
      <Fab color={bgcolor as any} aria-label="add">
        {icon}
      </Fab>
    </Box>
  );
};
