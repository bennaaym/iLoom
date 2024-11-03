"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchMaterialById } from "../api";
import { IMaterial } from "@/common/interfaces";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
} from "@mui/material";
import { PageLoading } from "@/common/loaders";
import { ErrorMessage } from "@/common/components/messages/ErrorMessage";
import Image from "next/image";

const ContentDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery<IMaterial, Error>({
    queryKey: ["material", id],
    queryFn: () => fetchMaterialById(id as string),
    enabled: !!id,
  });

  if (!id) {
    return <Typography color="error">No material ID provided.</Typography>;
  }

  const renderContent = () => {
    if (isLoading) return <PageLoading />;
    if (isError)
      return (
        <ErrorMessage message={`Failed to load content: ${error.message}`} />
      );
    if (!data) return <></>;

    return (
      <Paper sx={{ p: 4, maxWidth: 800, margin: "0 auto" }}>
        <Stack gap={2}>
          <Stack direction="row" gap={1} textTransform="capitalize">
            <Chip label={data.subject} variant="filled" color="primary" />
            <Chip label={data.activity} variant="filled" color="primary" />
          </Stack>
          {data.imageUrl && (
            <Box
              textAlign="center"
              width="100%"
              height="400px"
              position="relative"
            >
              <Image src={data.imageUrl} alt={data.content.title} fill />
            </Box>
          )}

          <Typography variant="h4" gutterBottom align="center">
            {data.content.title}
          </Typography>

          <Typography variant="body1" gutterBottom>
            {data.content.text}
          </Typography>

          {data.content.questions && data.content.questions.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Questions:
              </Typography>
              <List>
                {data.content.questions.map((questionObj, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {index + 1}. {questionObj.question}
                      </Typography>
                      <List>
                        {questionObj.options.map((option, optIndex) => (
                          <ListItem key={optIndex}>
                            <ListItemText
                              primary={`${String.fromCharCode(
                                65 + optIndex
                              )}. ${option}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Answer:</strong> {questionObj.answer}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box textAlign="center">
              <Button
                variant="outlined"
                onClick={() => router.push("/materials")}
                sx={{
                  "&:hover": {
                    color: "white",
                  },
                }}
              >
                Back to Materials
              </Button>
            </Box>
            {data.contentPdf && (
              <Box textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  href={data.contentPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View PDF
                </Button>
              </Box>
            )}
          </Stack>
        </Stack>
      </Paper>
    );
  };

  return <Box p={4}>{renderContent()}</Box>;
};

export default ContentDetail;
