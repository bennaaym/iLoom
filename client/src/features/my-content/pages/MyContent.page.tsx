import React from "react";
import { Box, Typography, Paper, CircularProgress, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

const MyContent = () => {
//   const { data: contents, isLoading, isError } = useQuery(["contents"], getContents);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        My Content
      </Typography>
      {false ? (
        <CircularProgress />
      ) : false ? (
        <Typography color="error">Failed to load content.</Typography>
      ) : (
        <Stack spacing={2}>
          {[].map((content: any) => (
            <Paper key={content.id} sx={{ p: 2 }}>
              <Typography variant="h6">{content.title}</Typography>
              <Typography>{content.description}</Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default MyContent;
