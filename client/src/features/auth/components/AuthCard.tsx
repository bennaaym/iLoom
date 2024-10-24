import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { GoogleIcon } from "./icons";
import { Formik, FormikValues } from "formik";
import { Alert } from "@mui/material";
import { ReactNode } from "react";
import Link from "next/link";
import { useGoogleAuth } from "../hooks";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

interface Props<Values extends FormikValues> {
  variant: "sign-in" | "sign-up";
  initialValues: Values;
  validationSchema: any;
  isLoading: boolean;
  error: ReactNode;
  onSubmit(values: Values): void;
}

export const AuthCard = <Values extends FormikValues>({
  variant,
  initialValues,
  validationSchema,
  isLoading,
  error,
  onSubmit,
}: Props<Values>) => {
  const { redirect: googleAuthRedirect } = useGoogleAuth();

  const isSignIn = variant === "sign-in";
  const title = isSignIn ? "Sign in" : "Sign up";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnChange
    >
      {({ values, errors, handleChange, handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Card variant="outlined">
              <Box sx={{ display: { xs: "flex", md: "none" } }}>iLoom</Box>
              <Typography
                component="h1"
                variant="h4"
                sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
              >
                {title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: 2,
                }}
              >
                {!isSignIn && (
                  <FormControl>
                    <FormLabel htmlFor="name">Full Name</FormLabel>
                    <TextField
                      variant="outlined"
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={values.name}
                      onChange={handleChange("name")}
                      error={Boolean(errors.name)}
                      helperText={<>{errors.name}</>}
                      autoComplete="off"
                    />
                  </FormControl>
                )}
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <TextField
                    variant="outlined"
                    id="email"
                    name="email"
                    type="text"
                    placeholder="example@iloom.ai"
                    value={values.email}
                    onChange={handleChange("email")}
                    error={Boolean(errors.email)}
                    helperText={<>{errors.email}</>}
                    autoComplete="off"
                  />
                </FormControl>
                <FormControl>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <FormLabel htmlFor="password">Password</FormLabel>
                  </Box>
                  <TextField
                    variant="outlined"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange("password")}
                    value={values.password}
                    error={Boolean(errors.password)}
                    helperText={<>{errors.password}</>}
                    autoFocus
                    fullWidth
                  />
                </FormControl>

                <Button
                  sx={{ textTransform: "capitalize", fontWeight: "800" }}
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                >
                  {title}
                </Button>
                <Typography sx={{ textAlign: "center" }}>
                  {isSignIn ? (
                    <>Don&apos;t have an account? </>
                  ) : (
                    <>You already have and account? </>
                  )}
                  <span>
                    <Link href={isSignIn ? "/auth/sign-up" : "/auth/sign-in"}>
                      {isSignIn ? "Sign up" : "Sign in"}
                    </Link>
                  </span>
                </Typography>
              </Box>
              <Divider>or</Divider>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  sx={{
                    borderColor: "primary.dark",
                    textTransform: "capitalize",
                  }}
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={googleAuthRedirect}
                >
                  {title} with Google
                </Button>
              </Box>
              {error && <Alert severity="error">{error}</Alert>}
            </Card>
          </form>
        );
      }}
    </Formik>
  );
};
