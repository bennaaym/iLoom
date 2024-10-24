import * as Yup from "yup";

export const signInValidation = {
  initialValue: { email: "", password: "" },
  schema: Yup.object().shape({
    email: Yup.string()
      .email("Email must be valid")
      .required("Email is required"),
    password: Yup.string()
      .min(8, ({ min }) => `Password should contain at least ${min} characters`)
      .max(16, ({ max }) => `Password cannot be longer than ${max} characters`)
      .required("Password is required"),
  }),
};

export const signUpValidation = {
  initialValue: { name: "", email: "", password: "" },
  schema: Yup.object().shape({
    name: Yup.string()
      .min(3, ({ min }) => `Name should contain at least ${min} characters`)
      .max(30, ({ max }) => `Name cannot be longer than ${max} characters`)
      .required("Name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
      .min(8, ({ min }) => `Password should contain at least ${min} characters`)
      .max(16, ({ max }) => `Password cannot be longer than ${max} characters`)
      .required("Password is required"),
  }),
};
