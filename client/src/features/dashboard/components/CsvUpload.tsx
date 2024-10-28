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

    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained" component="label">
                    Upload CSV
                    <input type="file" hidden accept=".csv" onChange={handleFileChange} />
                </Button>
                <Button variant="contained" color="secondary" onClick={handleUpload} disabled={!csvFile || mutation.isPending}>
                    {mutation.isPending ? <CircularProgress size={24} /> : "Send"}
                </Button>
                <Button variant="outlined" onClick={() => alert("Download Sample CSV")}>
                    Download Sample CSV
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
