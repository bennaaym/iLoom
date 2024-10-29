import React from "react";
import { Box, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import BaseForm, { FormFieldType } from "@/common/forms/BaseForm";
import { createEnglishStoryMaterial } from "@/features/generate-content/api/materials.api";
import { storyValidationSchema } from "@/features/generate-content/validations";

const formFields = [
  {
    id: "ageGroup",
    label: "Age Group",
    type: FormFieldType.SELECT,
    options: [
      { label: "Children", value: "children" },
      { label: "Teenagers", value: "teenagers" },
      { label: "Adults", value: "adults" },
    ],
    placeholder: "Select Age Group",
  },
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
    placeholder: "Select Level",
  },
  {
    id: "description",
    label: "Description",
    type: FormFieldType.TEXTAREA,
    placeholder: "Enter description",
  },
  {
    id: "image",
    label: "Upload Image",
    type: FormFieldType.FILE,
  },
];

const initialValues = {
  ageGroup: "",
  level: "",
  description: "",
  image: null as File | null,
};

const GenerateStoryFromImage: React.FC = () => {

  const mutation = useMutation({
    mutationFn: (data: FormData) => createEnglishStoryMaterial(data),

    onSuccess: (data) => {
    },
    onError: (error: any) => {
    },
  });

  const handleSubmit = (values: typeof initialValues) => {
    const formData = new FormData();
    formData.append("level", values.level);
    formData.append("ageGroup", values.ageGroup);
    formData.append("description", values.description);
    formData.append("activity", "story");
    if (values.image) {
      formData.append("image", values.image);
    }
    mutation.mutate(formData);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Generate Story from Image
      </Typography>
      <BaseForm
        fields={formFields}
        initialValues={initialValues}
        validationSchema={storyValidationSchema}
        submitLabel="Generate Story"
        isLoading={mutation.isPending}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default GenerateStoryFromImage;