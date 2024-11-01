"use client";
import React from "react";
import {
  Box,
  Typography,
  Grid2,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchMaterials } from "../api";
import { IMaterial } from "@/common/interfaces";
import { useRouter } from "next/navigation";
import { PageLoading } from "@/common/loaders";
import { ErrorMessage } from "@/common/components/messages/ErrorMessage";
import { brand, gray } from "@/common/theme";
import Link from "next/link";

const MyContent: React.FC = () => {
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery<IMaterial[], Error>({
    queryKey: ["materials"],
    queryFn: fetchMaterials,
  });

  const renderContent = () => {
    if (isLoading) return <PageLoading />;
    if (isError)
      return (
        <ErrorMessage message={`Failed to load content: ${error.message}`} />
      );

    if (!data?.length)
      return <Typography color={gray[400]}>No Material available</Typography>;

    return (
      <Grid2
        container
        columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        columnSpacing={2}
        rowSpacing={2}
        alignItems="center"
        justifyContent={{ sm: "center", md: "flex-start" }}
      >
        {data.map((material) => (
          <Grid2 key={material.id}>
            <Box width={250} height={150}>
              <Link href={`/materials/${material.id}`}>
                <Card
                  variant="outlined"
                  elevation={0}
                  sx={{
                    boxShadow: "none",
                    display: "block",
                    width: "100%",
                    height: "100%",
                    "&:hover": {
                      bgcolor: brand[400],
                      color: "white",
                      cursor: "pointer",
                    },
                    position: "relative",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {material.content.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {material.content.text}
                    </Typography>
                    <Chip
                      label={material.subject}
                      variant="filled"
                      color="primary"
                      sx={{
                        position: "absolute",
                        bottom: 10,
                        textTransform: "capitalize",
                      }}
                    />
                  </CardContent>
                </Card>
              </Link>
            </Box>
          </Grid2>
        ))}
      </Grid2>
    );
  };

  return (
    <Stack p={4} gap={4}>
      <Typography variant="h4" gutterBottom color="primary">
        My Materials
      </Typography>
      {renderContent()}
    </Stack>
  );
};

export default MyContent;
