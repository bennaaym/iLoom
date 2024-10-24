"use client";

import { ReactNode } from "react";
import { AppBar, Toolbar, Typography, Box, CssBaseline, IconButton } from "@mui/material";
import { IoMdExit } from "react-icons/io";
import { useAuth } from "@/common/providers/AuthProvider";

interface ClassroomLayoutProps {
  children: ReactNode;
}

export default function ClassroomLayout({ children }: ClassroomLayoutProps) {
  const { signOut } = useAuth();

  return (
    <Box display="flex" height="100vh">
      <CssBaseline />
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontSize={24} fontWeight="bold">
            iLoom.ai Classroom
          </Typography>
          <IconButton onClick={signOut}>
            <IoMdExit />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box mt={8} p={2} width="100%">
        {children}
      </Box>
    </Box>
  );
}
