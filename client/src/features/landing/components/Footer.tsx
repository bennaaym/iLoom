import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import FooterBg from "../assets/images/footer-bg.png";

export const Footer = () => {
  return (
    <Box
      // component="footer"
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
      height={100}
    >
      <Box width="100%">
        <Image src={FooterBg} alt="footer-bg" fill />
      </Box>
      <Typography
        variant="body2"
        color="white"
        fontWeight="700"
        zIndex={100}
        position="absolute"
        fontSize={18}
      >
        © {new Date().getFullYear()} iLoom. All rights reserved.
      </Typography>
    </Box>
  );
};
