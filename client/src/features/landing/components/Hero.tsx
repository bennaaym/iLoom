"use client";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { brand, gray } from "@/common/theme";
import HeroBg from "../assets/images/hero-bg.png";
import HeroIllustration from "../assets/images/hero-illustration.svg";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();
  return (
    <Box
      id="hero"
      width="100%"
      height="100vh"
      position="relative"
      sx={(theme) => {
        return {
          [theme.breakpoints.down("md")]: {
            height: "50vh",
          },
        };
      }}
    >
      <Box
        position="absolute"
        left={0}
        right={0}
        top={-60}
        bottom={0}
        width="100vw"
        height="100%"
      >
        <Image src={HeroBg} alt="hero-image" fill objectFit="cover" />
      </Box>
      <Box pt={15}>
        <Container maxWidth="sm">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Stack spacing={3} justifyContent="center" alignItems="center">
              <Typography
                maxWidth={400}
                variant="h3"
                textAlign="center"
                color="primary"
                fontWeight={900}
                fontSize={32}
                whiteSpace="wrap"
              >
                Transform Your Teaching Experience with iLoom
              </Typography>
              <Typography
                textAlign="center"
                fontWeight="500"
                fontSize={18}
                color={gray[500]}
              >
                iLoom simplifies your teaching experience. Organize classes,
                engage students with live video, and generate personalized
                content—all in one platform designed for modern educators.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  textTransform: "capitalize",
                  width: "fit-content",
                  borderRadius: "5px",
                  boxShadow: "none",
                  bgcolor: "primary",
                  fontWeight: 800,
                  "&:hover": {
                    bgcolor: brand[400],
                    opacity: 0.9,
                  },
                }}
                onClick={() => router.push("/auth/sign-up")}
              >
                get started
              </Button>
            </Stack>
            <Box
              mt={6}
              left={-16}
              position="relative"
              zIndex={4}
              sx={(theme) => {
                return {
                  [theme.breakpoints.down("md")]: {
                    display: "none",
                  },
                };
              }}
            >
              <motion.div
                style={{ width: "100%", height: "auto" }}
                animate={{
                  scale: [0.95, 1, 0.95],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                <Image
                  width={600}
                  src={HeroIllustration}
                  alt="hero-illustration"
                />
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
