"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

export default function Whiteboard() {
  return (
    <Box
      width="100%"
      height="100%"
      bgcolor="#f0f0f0"
      display="flex"
      alignItems="center"
      justifyContent="center"
      border="1px solid #ccc"
      borderRadius="8px"
    >
      <Typography variant="h5" color="textSecondary">
        Whiteboard Placeholder
      </Typography>
    </Box>
  );
}
