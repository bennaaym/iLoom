import React from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const englishModules = [
  {
    title: "Article Generator",
    description: "Create engaging reading texts for different levels.",
    path: "/generate-content/english/article-generator",
    icon: "📝",
  },
  {
    title: "Generate Story from Image",
    description: "Generate creative stories based on an image.",
    path: "/generate-content/english/generate-story-from-image",
    icon: "📷",
  },
];

const EnglishContent = () => {
  const router = useRouter();

  const handleModuleSelect = (path: string) => {
    router.push(path);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        English Content Modules
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        Select a tool to generate English learning content.
      </Typography>
      
      <Grid container spacing={4}>
        {englishModules.map((module) => (
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

export default EnglishContent;
