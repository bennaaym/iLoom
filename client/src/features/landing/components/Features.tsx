import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import { features } from "../constants";

import { gray } from "@/common/theme";
import React, { ReactNode } from "react";

interface FeatureItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export const FeatureItem = ({ title, description, icon }: FeatureItemProps) => {
  return (
    <Stack gap={1} alignItems="center" justifyContent="center" maxWidth={300}>
      <Box
        border={1}
        borderRadius="100%"
        borderColor={gray[500]}
        width={50}
        height={50}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="primary"
      >
        {icon}
      </Box>
      <Typography
        variant="body1"
        fontWeight="600"
        textTransform="capitalize"
        color="primary"
      >
        {title}
      </Typography>
      <Typography color={gray[500]} textAlign="center">
        {description}
      </Typography>
    </Stack>
  );
};

export const Features = () => {
  return (
    <Stack gap={4} id="features">
      <Typography
        variant="h3"
        textAlign="center"
        fontWeight="800"
        color="primary"
      >
        Features
      </Typography>
      <Container>
        <Grid2
          container
          columns={{ sm: 1, md: 2, lg: 3 }}
          columnSpacing={4}
          rowSpacing={4}
          alignItems="center"
          justifyContent="center"
        >
          {features.map((feature, index) => {
            return (
              <Grid2 key={index}>
                <FeatureItem
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                />
              </Grid2>
            );
          })}
        </Grid2>
      </Container>
    </Stack>
  );
};
