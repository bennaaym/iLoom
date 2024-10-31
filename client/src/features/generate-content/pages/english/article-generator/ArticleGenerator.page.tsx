import React from "react";
import { Box, Typography } from "@mui/material";
import BaseForm, { FormFieldType } from "@/common/forms/BaseForm";
import { createEnglishMaterial } from "@/features/generate-content/api/materials.api";
import { articleGenerationValidationSchema } from "@/features/generate-content/validations";
import { useMutation } from "@tanstack/react-query";

const ArticleGenerator = () => {
  const mutation = useMutation({
    mutationFn: (data: Record<string, any>) => createEnglishMaterial(data),

    onSuccess: () => {},
    onError: (error: any) => {},
  });

  const handleGenerateArticle = (values: Record<string, any>) => {
    mutation.mutate({ ...values, activity: "reading" });
  };

  const fields = [
    {
      id: "level",
      label: "Level",
      type: FormFieldType.SELECT,
      options: [
        { label: "Beginner (A1)", value: "A1" },
        { label: "Elementary (A2)", value: "A2" },
        { label: "Intermediate (B1)", value: "B1" },
        { label: "Upper-Intermediate (B2)", value: "B2" },
        { label: "Advanced (C1)", value: "C1" },
        { label: "Proficiency (C2)", value: "C2" },
      ],
      placeholder: "Select the article level",
    },
    {
      id: "ageGroup",
      label: "Target Age Group",
      type: FormFieldType.SELECT,
      options: [
        { label: "Teen (13-17)", value: "Teen (13-17)" },
        { label: "Young Adult (18-25)", value: "Young Adult (18-25)" },
        { label: "Adult (25+)", value: "Adult (25+)" },
      ],
      placeholder: "Select the target age group",
    },
    {
      id: "description",
      label: "Content Description",
      type: FormFieldType.TEXTAREA,
      placeholder: "Enter the main topic or theme of the article",
    },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom color="primary">
        Article Generator
      </Typography>

      <BaseForm
        fields={fields}
        initialValues={{ level: "", targetAgeGroup: "", description: "" }}
        validationSchema={articleGenerationValidationSchema}
        submitLabel="Generate Article"
        isLoading={mutation.isPending}
        onSubmit={handleGenerateArticle}
      />
    </Box>
  );
};

export default ArticleGenerator;
