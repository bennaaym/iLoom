import { gray } from "@/common/theme";
import { Stack, Box, Container, Grid2, Typography } from "@mui/material";
import React from "react";
import { teamMembers } from "../constants";
import Image from "next/image";

interface TeamMemberCardProps {
  name: string;
  title: string;
  image: string;
}

const TeamMemberCard = ({ name, title, image }: TeamMemberCardProps) => {
  return (
    <Box
      height={300}
      width={300}
      border={1}
      borderColor={gray[100]}
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      m={0}
      padding={0}
    >
      <Box
        width={200}
        height={200}
        border={1}
        borderRadius="100%"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Image src={image} alt="team memeber" width={200} height={200} />
      </Box>
      <Box
        bgcolor="white"
        width="100%"
        height="30%"
        bottom={0}
        textAlign="center"
        p={2}
      >
        <Typography fontWeight={600} fontSize={18}>
          {name}
        </Typography>
        <Typography fontSize={16} textTransform="capitalize" color={gray[500]}>
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export const Team = () => {
  return (
    <Stack gap={4} id="team">
      <Typography
        variant="h3"
        textAlign="center"
        fontWeight="800"
        color="primary"
      >
        Team
      </Typography>
      <Container>
        <Grid2
          container
          columns={{ sm: 1, md: 2 }}
          alignItems="center"
          justifyContent="center"
          columnGap={4}
          rowGap={4}
        >
          {teamMembers.map((member, index) => {
            return (
              <Grid2 key={index}>
                <TeamMemberCard
                  name={member.name}
                  title={member.title}
                  image={member.image}
                />
              </Grid2>
            );
          })}
        </Grid2>
      </Container>
    </Stack>
  );
};
