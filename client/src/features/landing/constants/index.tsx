import { IoMdClipboard } from "react-icons/io";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { MdLibraryBooks, MdOndemandVideo, MdQuiz } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { VscRobot } from "react-icons/vsc";
import { brand } from "@/common/theme";
import TeamMemberYusuf from "../assets/images/team-yusuf.png";
import TeamMemberBennaaym from "../assets/images/team-bennaaym.jpg";

export const features = [
  {
    icon: <SiGoogleclassroom size={30} color={brand[400]} />,
    title: "Classroom Scheduling",
    description:
      "Easily manage and organize class schedules with streamlined, customizable options for each session.",
  },
  {
    icon: <MdLibraryBooks size={30} color={brand[400]} />,
    title: "Comprehensive Material Preparation",
    description:
      "Prepare materials in advance for multiple subjects, ensuring each class is equipped with the right resources.",
  },
  {
    icon: <MdOndemandVideo size={30} color={brand[400]} />,
    title: "High-Quality Video Conferencing",
    description:
      "Engage students with reliable, high-quality video conferencing that supports seamless interaction and collaboration.",
  },
  {
    icon: <IoChatboxEllipsesOutline size={30} color={brand[400]} />,
    title: "Instant Classroom Chat",
    description:
      "Foster open communication with real-time chat, enabling students and teachers to share feedback and ideas instantly.",
  },
  {
    icon: <IoMdClipboard size={30} color={brand[400]} />,
    title: "Interactive Whiteboard",
    description:
      "Bring concepts to life with our dynamic whiteboard, ideal for enhancing visual explanations and student participation.",
  },
  {
    icon: <VscRobot size={38} color={brand[400]} />,
    title: "AI-Powered Content Generation",
    description:
      "Generate tailored content on the spot with advanced AI models, providing relevant, personalized material for each lesson.",
  },
  {
    icon: <MdQuiz size={30} color={brand[400]} />,
    title: "Quizzes and Interactive Sessions",
    description:
      "Boost engagement and knowledge retention with interactive quizzes and sessions designed to make learning enjoyable and effective.",
  },
];

export const teamMembers = [
  {
    name: "Aymen Bennabi",
    title: "full-stack developer",
    image: TeamMemberBennaaym.src,
  },
  {
    name: "Yusuf Özaslan",
    title: "full-stack developer",
    image: TeamMemberYusuf.src,
  },
];
