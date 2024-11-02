"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import BaseForm, { FormFieldType } from "@/common/forms/BaseForm";
import { createAlgorithmMaterial } from "@/features/generate-content/api/materials.api";
import { algorithmQuestionValidationSchema } from "@/features/generate-content/validations";
import { useRouter } from "next/navigation";

const formFields = [
    {
        id: "level",
        label: "Difficulty Level",
        type: FormFieldType.SELECT,
        options: [
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
            { label: "Advanced", value: "advanced" },
        ],
        placeholder: "Select difficulty level",
    },
    {
        id: "topic",
        label: "Algorithm Topic",
        type: FormFieldType.SELECT,
        options: [
            { label: "Sorting", value: "Sorting" },
            { label: "Graphs", value: "Graphs" },
            { label: "Dynamic Programming", value: "Dynamic Programming" },
            { label: "Data Structures", value: "Data Structures" },
            { label: "Recursion", value: "Recursion" },
        ],
        placeholder: "Select algorithm topic",
    },
    {
        id: "description",
        label: "Description",
        type: FormFieldType.TEXTAREA,
        placeholder: "Enter a brief description of the questions",
    },
];

const initialValues = {
    level: "",
    topic: "",
    description: "",
};

const AlgorithmQuestionGenerator = () => {
    const router = useRouter();
    const mutation = useMutation({
        mutationFn: (data: Record<string, any>) => createAlgorithmMaterial(data),
        onSuccess: (data: any) => {
            router.push(`/materials/${data.id}`);
        },
        onError: (error: any) => {
            console.error("Error generating question:", error);
        },
    });

    const handleSubmit = (values: typeof initialValues) => {
        mutation.mutate({ ...values, activity: "algorithm" });
    };

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom color="primary">
                Question Generator
            </Typography>
            <BaseForm
                fields={formFields}
                initialValues={initialValues}
                validationSchema={algorithmQuestionValidationSchema}
                submitLabel="Generate Question"
                isLoading={mutation.isPending}
                onSubmit={handleSubmit}
            />
        </Box>
    );
};

export default AlgorithmQuestionGenerator;
