"use client";
import { Stack } from "@mui/material";
import { Layout } from "../components";
import { AuthCard } from "../components/AuthCard";
import { useSignUp } from "../hooks";
import { signUpValidation } from "../validations";
import { useAuth } from "@/common/providers/AuthProvider";

export const SignUp = () => {
  const { setUser } = useAuth();
  const { signUp, isLoading, error } = useSignUp();

  const handleSubmit = (values: typeof signUpValidation.initialValue) => {
    signUp(values, {
      onSuccess(data) {
        setUser(data);
      },
    });
  };

  return (
    <Layout
      renderLeft={() => (
        <Stack>
          <AuthCard
            variant="sign-up"
            initialValues={signUpValidation.initialValue}
            validationSchema={signUpValidation.schema}
            isLoading={isLoading}
            error={error && error.message}
            onSubmit={handleSubmit}
          />
        </Stack>
      )}
    />
  );
};
