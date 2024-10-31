import { Theme, Components } from "@mui/material/styles";
import { brand } from "./primitives";

export const buttonsCustomizations: Components<Theme> = {
  MuiButtonBase: {
    defaultProps: {
      disableTouchRipple: true,
      disableRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        "&:hover": {
          backgroundColor: brand[400],
          opacity: 0.9,
        },
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: () => ({
        borderRadius: "5px",
        boxShadow: "none",
      }),
    },
  },
  MuiFab: {
    styleOverrides: {
      root: () => ({
        "&:hover": {
          backgroundColor: brand[400],
          opacity: 0.9,
        },
      }),
    },
  },
};
