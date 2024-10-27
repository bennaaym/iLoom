import * as Yup from "yup";

export const createClassroomContentValidation = {
  initialValue: { subject: "", level: "", activity: "" },
  schema: Yup.object().shape({
    subject: Yup.string().required("Subject is required"),
    level: Yup.string().required("Level is required"),
    activity: Yup.string().required("Activity is required"),
  }),
};
