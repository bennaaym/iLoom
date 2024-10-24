"use client";
import { Stack } from "@mui/material";
import { Layout } from "../components";
import { AuthCard } from "../components/AuthCard";
import { useSignIn } from "../hooks";
import { signInValidation } from "../validations";
import { useAuth } from "@/common/providers/AuthProvider";

export const SignIn = () => {
  const { setUser } = useAuth();
  const { signIn, isLoading, error } = useSignIn();

  const handleSubmit = (values: typeof signInValidation.initialValue) => {
    signIn(values, {
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
            variant="sign-in"
            initialValues={signInValidation.initialValue}
            validationSchema={signInValidation.schema}
            isLoading={isLoading}
            error={error && error.message}
            onSubmit={handleSubmit}
          />
        </Stack>
      )}
    />
  );
};
