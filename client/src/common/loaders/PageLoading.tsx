import { Box, Typography } from "@mui/material";
import React from "react";
import { BounceLoader } from "react-spinners";
import { brand } from "../theme";

export const PageLoading = () => {
  return (
    <Box
      display="flex"
      width="full"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <BounceLoader size={240} color={brand[500]} />
      <Typography
        fontSize={40}
        fontWeight="800"
        position="absolute"
        color="white"
      >
        iLoom
      </Typography>
    </Box>
  );
};
