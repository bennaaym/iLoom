"use client";
import React from "react";
import { Typography, Paper, Button, Stack, Grid2 } from "@mui/material";
import { useRouter } from "next/navigation";

const englishModules = [
  {
    title: "Article Generator",
    description: "Create engaging reading texts for different levels.",
    path: "/subjects/english/article-generator",
    icon: "📝",
  },
  {
    title: "Generate Story from Image",
    description: "Generate creative stories based on an image.",
    path: "/subjects/english/generate-story-from-image",
    icon: "📷",
  },
];

const EnglishContent = () => {
  const router = useRouter();

  const handleModuleSelect = (path: string) => {
    router.push(path);
  };

  return (
    <Stack p={4} gap={4}>
      <Typography variant="h4" gutterBottom color="primary">
        English Subject
      </Typography>

      <Grid2 container columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
        {englishModules.map((module) => (
          <Grid2 key={module.title}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                width: 350,
                height: 150,
                py: 2,
              }}
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
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
};

export default EnglishContent;
