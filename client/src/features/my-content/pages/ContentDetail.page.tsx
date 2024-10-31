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
} from "@mui/material";
import { PageLoading } from "@/common/loaders";
import { ErrorMessage } from "@/common/components/messages/ErrorMessage";

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
        <ErrorMessage message={` Failed to load content: ${error.message}`} />
      );
    if (!data) return <></>;
    return (
      <Paper sx={{ p: 4, maxWidth: 800, margin: "0 auto" }}>
        <Typography variant="h4" gutterBottom align="center">
          {data.content.title}
        </Typography>

        <Typography variant="body1" gutterBottom>
          {data.content.text}
        </Typography>
        {data.content.questions && data.content.questions.length > 0 && (
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Questions:
            </Typography>
            <List>
              {data.content.questions.map((question: string, index: number) => (
                <ListItem key={index}>
                  <ListItemText primary={`${index + 1}. ${question}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {data.content.answers && data.content.answers.length > 0 && (
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Answers:
            </Typography>
            <List>
              {data.content.answers.map((answer: string, index: number) => (
                <ListItem key={index}>
                  <ListItemText primary={`${index + 1}. ${answer}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {data.imageUrl && (
          <Box mt={2} textAlign="center">
            <img
              src={data.imageUrl}
              alt={data.content.title}
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
                marginBottom: "20px",
                cursor: "pointer",
                borderRadius: "8px",
              }}
              onClick={() => window.open(data.imageUrl, "_blank")}
            />
          </Box>
        )}

        <Box mt={2}>
          <Typography variant="body1" gutterBottom>
            <strong>Activity:</strong> {data.activity}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Subject:</strong> {data.subject}
          </Typography>
        </Box>

        {data.contentPdf && (
          <Box mt={2} textAlign="center">
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

        <Box mt={4} textAlign="center">
          <Button variant="outlined" onClick={() => router.back()}>
            Back to Materials
          </Button>
        </Box>
      </Paper>
    );
  };

  return <Box p={4}>{renderContent()}</Box>;
};

export default ContentDetail;
