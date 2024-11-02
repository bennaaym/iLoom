"use client";
import React from "react";
import { Typography, Paper, Stack, Grid2 } from "@mui/material";
import { useRouter } from "next/navigation";

const computerScienceModules = [
  {
    title: "Question Generator",
    description: "Generate challenging algorithmic critical thinking questions.",
    path: "/subjects/algorithm/algorithm-question-generator",
    icon: "🧠",
  },
];

const Algorithm = () => {
  const router = useRouter();

  const handleModuleSelect = (path: string) => {
    router.push(path);
  };

  return (
    <Stack p={4} gap={4}>
      <Typography variant="h4" gutterBottom color="primary">
        Computer Science Subjects
      </Typography>

      <Grid2 container columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
        {computerScienceModules.map((module) => (
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
            </Paper>
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
};

export default Algorithm;
