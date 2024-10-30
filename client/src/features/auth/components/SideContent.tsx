import { gray } from "@/common/theme";
import { features } from "@/features/landing/constants";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const SideContent = () => {
  return (
    <Stack
      sx={{
        flexDirection: "column",
        gap: 4,
        maxWidth: 450,
      }}
    >
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <Typography fontWeight="bold" fontSize={40} color="primary">
          iLoom
        </Typography>
      </Box>
      {features.map((feature, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {feature.icon}
          <div>
            <Typography gutterBottom fontWeight="600" color="primary">
              {feature.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary" }}
              color={gray[500]}
            >
              {feature.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
};
