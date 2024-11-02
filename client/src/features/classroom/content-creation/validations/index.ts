import * as Yup from "yup";

export const createClassroomContentValidation = {
  initialValue: {
    subject: "",
    level: "",
    activity: "",
    ageGroup: "",
    description: "",
    image: null as File | null,
    topic: "",
  },
  schema: Yup.object().shape({
    subject: Yup.string().required("Subject is required"),
    level: Yup.string().required("Level is required"),
    activity: Yup.string().required("Activity is required"),
    ageGroup: Yup.string()
      .nullable()
      .when("activity", (activity: string | string[], schema) => {
        const activityValue = Array.isArray(activity) ? activity[0] : activity;
        return ["reading", "story"].includes(activityValue)
          ? schema.required("Age Group is required")
          : schema;
      }),
    topic: Yup.string()
      .nullable()
      .when("subject", {
        is: "algorithm",
        then: (schema) => schema.required("Topic is required"),
      }),
    description: Yup.string()
      .nullable()
      .when("activity", (activity: string | string[], schema) => {
        const activityValue = Array.isArray(activity) ? activity[0] : activity;
        return ["reading", "story"].includes(activityValue)
          ? schema.required("Description is required")
          : schema;
      }),
    image: Yup.mixed<File>()
      .nullable()
      .when("activity", (activity: string | string[], schema) => {
        const activityValue = Array.isArray(activity) ? activity[0] : activity;
        return activityValue === "story"
          ? schema
              .required("Image is required")
              .test("fileType", "Unsupported File Format", (value) => {
                if (!value) return true;
                return ["image/jpeg", "image/png"].includes(value.type);
              })
          : schema;
      }),
  }),
};
