import { Box, Stack } from "@mui/material";
import React, { Fragment, PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import { useAuth } from "../providers/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const MainLayout = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();

  return (
    <Fragment>
      <Stack>
        {user && <Navbar />}
        <Box component="main" mt={user ? "70px" : 0}>
          {children}
        </Box>
      </Stack>
      <ToastContainer />
    </Fragment>
  );
};
