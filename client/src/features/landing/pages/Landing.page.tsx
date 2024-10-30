import { Box, Stack } from "@mui/material";
import React, { Fragment } from "react";
import { Features, Footer, Hero, Navbar, Team } from "../components";

export const Landing = () => {
  return (
    <Fragment>
      <Navbar />
      <Stack width="full" minHeight="100vh" bgcolor="#fff" gap={8}>
        <Hero />
        <Features />
        <Team />
        <Footer />
      </Stack>
    </Fragment>
  );
};
