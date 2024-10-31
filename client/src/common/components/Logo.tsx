import { Typography } from "@mui/material";
import React from "react";
import { brand } from "../theme";

export const Logo = () => {
  return (
    <Typography
      sx={{
        fontFamily: "Quicksand",
        fontWeight: 800,
        letterSpacing: ".3rem",
        color: brand[400],
        textDecoration: "none",
        fontSize: 40,
        textAlign: "center",
      }}
    >
      iLoom
    </Typography>
  );
};
