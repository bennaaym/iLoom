import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SiGoogleclassroom } from "react-icons/si";
import { MdOndemandVideo } from "react-icons/md";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoMdClipboard } from "react-icons/io";
import { VscRobot } from "react-icons/vsc";

const features = [
  {
    icon: <SiGoogleclassroom size={30} />,
    title: "Classroom Scheduling",
    description:
      "Simplify class management with Classroom Scheduling, keeping your sessions organized and timely with ease.",
  },
  {
    icon: <MdOndemandVideo size={30} />,
    title: "Powerful Video Conferencing",
    description:
      "Engage students in real-time with high-quality Video Conferencing that supports seamless communication and collaboration.",
  },
  {
    icon: <IoChatboxEllipsesOutline size={30} />,
    title: "Instant Class Chat",
    description:
      "Facilitate instant communication with Class Chat, allowing students and teachers to share ideas and feedback effortlessly.",
  },
  {
    icon: <IoMdClipboard size={30} />,
    title: "Interactive Whiteboard",
    description:
      "Visualize and explain concepts more effectively with our Interactive Whiteboard, designed to enhance participation and creativity.",
  },
  {
    icon: <VscRobot size={38} />,
    title: "On-the-Spot Content Generation",
    description:
      "Utilize Fine tuned Generative AI Models to create personalized, AI-powered content in real time, delivering up-to-date learning material at your fingertips.",
  },
];

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
        <Typography fontWeight="bold" fontSize={40}>
          iLoom
        </Typography>
      </Box>
      {features.map((feature, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {feature.icon}
          <div>
            <Typography gutterBottom fontWeight="600">
              {feature.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {feature.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
};
