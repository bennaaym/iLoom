import React from "react";
import { Box, Typography, Button } from "@mui/material";

const AlgorithmContentGenerator = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Algorithm Content Generator
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Create coding exercises, challenges, and algorithm explanations with AI.
      </Typography>
      <Button variant="contained" color="primary">
        Start Generating Algorithm Content
      </Button>
    </Box>
  );
};

export default AlgorithmContentGenerator;
