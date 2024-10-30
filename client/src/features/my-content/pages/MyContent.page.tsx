import React from "react";
import { Box, Typography, Card, CardContent, CardMedia, CircularProgress, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchMaterials } from "../api";
import { IMaterial } from "@/common/interfaces";
import { useRouter } from 'next/navigation';

const MyContent: React.FC = () => {
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery<IMaterial[], Error>({
    queryKey: ["materials"],
    queryFn: fetchMaterials,
  });

  const handleCardClick = (id: string) => {
    router.push(`/my-content/${id}`);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        My Content
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Typography color="error">Failed to load content: {error.message}</Typography>
      ) : (
        <Grid container spacing={4}>
          {data && data.length > 0 ? (
            data.map((material) => (
              <Grid item xs={12} sm={6} md={4} key={material.id}>
                <Card
                  onClick={() => handleCardClick(material.id)}
                  sx={{
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {material.content.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {material.content.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No content available.</Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default MyContent;
