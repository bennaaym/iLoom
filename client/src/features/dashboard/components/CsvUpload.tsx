import React, { useState, ChangeEvent } from "react";
import { Box, Button, Stack, CircularProgress } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudentsCsv } from "../api/studentManegement.api";
import { ErrorMessage } from "@/common/components/messages/ErrorMessage";

export const CsvUpload: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvErrors, setCsvErrors] = useState<string>("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => createStudentsCsv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setCsvFile(null);
      setCsvErrors("");
    },
    onError: (error: any) => {
      setCsvErrors(error?.message || "Failed to upload CSV file");
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      setCsvErrors("Invalid file type. Please upload a CSV file.");
    }
    event.target.value = "";
  };

  const handleUpload = () => {
    if (csvFile) mutation.mutate(csvFile);
  };

  const downloadSampleCsv = () => {
    const sampleCsv =
      "name,email,password\nJohn Doe,johndoe@example.com,password123";
    const blob = new Blob([sampleCsv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample_students.csv";
    link.click();
  };

  return (
    <Box>
      <Stack direction="column" gap={2} alignItems="center">
        <Button
          variant="outlined"
          onClick={downloadSampleCsv}
          fullWidth
          sx={{
            "&:hover": {
              color: "white",
            },
          }}
        >
          Sample CSV
        </Button>
        <Button variant="contained" component="label" fullWidth>
          Upload CSV
          <input type="file" hidden accept=".csv" onChange={handleFileChange} />
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpload}
          disabled={!csvFile || mutation.isPending}
          fullWidth
        >
          {mutation.isPending ? <CircularProgress size={24} /> : "Send"}
        </Button>
      </Stack>
      {!!csvErrors && (
        <Box mt={2}>
          <ErrorMessage message={csvErrors} />
        </Box>
      )}
    </Box>
  );
};
