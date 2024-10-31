"use client";
import { Box, Stack } from "@mui/material";
import React, { Fragment, PropsWithChildren } from "react";
import { Sidebar } from "./Sidebar";

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <Fragment>
      <Stack direction="row">
        <Sidebar />
        <Box component="main" flexGrow={1}>
          {children}
        </Box>
      </Stack>
    </Fragment>
  );
};
