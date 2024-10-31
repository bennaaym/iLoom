import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  inputsCustomizations,
  buttonsCustomizations,
  colorSchemes,
  typography,
  shadows,
  shape,
} from "../theme";
import { CssBaseline } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

export const AppThemeProvider = ({ children }: Props) => {
  const theme = React.useMemo(() => {
    return createTheme({
      cssVariables: {
        colorSchemeSelector: "data-mui-color-scheme",
        cssVarPrefix: "template",
      },
      colorSchemes,
      typography,
      shadows,
      shape,
      components: {
        ...inputsCustomizations,
        ...buttonsCustomizations,
      },
    });
  }, []);
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
