"use client";

import { ReactNode } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  IconButton,
  Stack,
  Avatar,
} from "@mui/material";
import { IoMdExit } from "react-icons/io";
import { useAuth } from "@/common/providers/AuthProvider";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();

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
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap={1}
          >
            {user && (
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  fontSize: 16,
                  fontWeight: "800",
                  bgcolor: "white",
                  color: "primary.main",
                }}
              >
                {user.name
                  .split(" ")
                  .map((value) => value.at(0)?.toUpperCase())}
              </Avatar>
            )}
            <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="sign out"
              onClick={signOut}
            >
              <IoMdExit size={28} />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
