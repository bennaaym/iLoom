import { Box, Stack } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import { useAuth } from "../providers/AuthProvider";

export const MainLayout = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();

  return (
    <Stack>
      {user && <Navbar />}

      <Box component="main" minHeight="auto" mt="70px">
        {children}
      </Box>
    </Stack>
  );
};
