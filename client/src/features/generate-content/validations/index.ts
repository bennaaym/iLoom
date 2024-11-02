import * as Yup from "yup";

export const articleGenerationValidationSchema = Yup.object({
  level: Yup.string().required("Level is required"),
  ageGroup: Yup.string().required("Target age group is required"),
  description: Yup.string().required("Content description is required"),
});

export const storyValidationSchema = Yup.object().shape({
  ageGroup: Yup.string().required("Age group is required"),
  level: Yup.string().required("Level is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.mixed()
    .required("An image is required")
    .test("fileType", "Unsupported File Format", (value) => {
      if (value instanceof File) {
        return ["image/jpeg", "image/png"].includes(value.type);
      }
      return false;
    }),
});

export const algorithmQuestionValidationSchema = Yup.object({
  level: Yup.string().required("Difficulty level is required"),
  topic: Yup.string().required("Algorithm topic is required"),
  description: Yup.string().required("Description is required"),
});
