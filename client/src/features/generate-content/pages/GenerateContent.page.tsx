import React from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const modules = [
  {
    title: "English",
    description: "Generate English learning activities with AI assistance.",
    path: "/generate-content/english",
    icon: "📘",
  },
  {
    title: "Algorithm",
    description: "Create algorithm and coding exercises for students.",
    path: "/generate-content/algorithm",
    icon: "💻",
  },
];

const GenerateContent = () => {
  const router = useRouter();

  const handleModuleSelect = (path: string) => {
    router.push(path);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Content Generator
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        Select a module to start generating educational content.
      </Typography>
      
      <Grid container spacing={4}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.title}>
            <Paper
              elevation={3}
              sx={{ p: 3, textAlign: "center", cursor: "pointer" }}
              onClick={() => handleModuleSelect(module.path)}
            >
              <Typography variant="h5" gutterBottom>
                {module.icon} {module.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {module.description}
              </Typography>
              <Button variant="contained" color="primary">
                Explore
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GenerateContent;
