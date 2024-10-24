"use client";

import { ReactNode } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  IconButton,
} from "@mui/material";
import { IoMdExit } from "react-icons/io";
import { useAuth } from "@/common/providers/AuthProvider";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { signOut } = useAuth();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgColor: "red" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ backgroundColor: "primary.main", color: "white" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            fontSize={28}
            fontWeight="bold"
            color="white"
            component="div"
          >
            iLoom.ai
          </Typography>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="sign out"
            onClick={signOut}
          >
            <IoMdExit size={28} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
