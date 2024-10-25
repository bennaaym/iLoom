import { Box, Stack } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import { usePathname } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";

export const MainLayout = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();

  return (
    <Stack>
      {user && <Navbar />}
      <Box component="main" mt={user ? "70px" : 0}>
        {children}
      </Box>
    </Stack>
  );
};
