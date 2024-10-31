"use client";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Logo } from "./Logo";
import { Avatar, IconButton, Stack, Typography } from "@mui/material";
import { useAuth } from "@/common/providers/AuthProvider";
import { IoMdExit } from "react-icons/io";
import { gray, brand } from "../theme";
import {
  RiDashboardLine,
  RiBookletLine,
  RiLightbulbFlashLine,
  RiGroupLine,
} from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";

const drawerWidth = 240;

const items = [
  {
    label: "Classes",
    href: "/classrooms",
    icon: <RiDashboardLine size={22} />,
    roles: ["student", "teacher", "admin"],
  },
  {
    label: "My Materials",
    href: "/materials",
    icon: <RiBookletLine size={22} />,
    roles: ["teacher", "admin"],
  },
  {
    label: "Generate Materials",
    href: "/subjects",
    icon: <RiLightbulbFlashLine size={22} />,
    roles: ["teacher", "admin"],
  },
  {
    label: "My Students",
    href: "/students",
    icon: <RiGroupLine size={22} />,
    roles: ["teacher", "admin"],
  },
];

export const Sidebar = () => {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const renderedItems = items
    .filter((item) => item.roles.includes(user?.role as string))
    .map((item) => {
      const isActive = pathname.includes(item.href);

      return (
        <Link href={item.href} key={item.href}>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                color: isActive ? "white" : brand[400],
                bgcolor: isActive ? brand[400] : "transparent",

                "&:hover": {
                  bgcolor: brand[400],
                  color: "white",
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? "white" : gray[400] }}>
                {item.icon}
              </ListItemIcon>
              <Typography fontWeight="600">{item.label}</Typography>
            </ListItemButton>
          </ListItem>
        </Link>
      );
    });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Stack bgcolor="#F4F5FA" gap={2}>
        <Box>
          <Logo />
          <Divider />
        </Box>
        <Box px={1}>
          <List>{renderedItems}</List>
        </Box>
      </Stack>
      <Box position="absolute" bottom={0} width="100%">
        <Divider />
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          p={2}
          bgcolor={gray[50]}
        >
          {user && (
            <Stack direction="row" gap={1} alignItems="center">
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: 16,
                  fontWeight: "800",
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                {user.name
                  .split(" ")
                  .map((value) => value.at(0)?.toUpperCase())}
              </Avatar>
              <Box>
                <Typography fontWeight="800" textTransform="capitalize">
                  {user.name}
                </Typography>
                <Typography fontWeight="600" color={gray[400]}>
                  {user.email}
                </Typography>
              </Box>
            </Stack>
          )}
          <IconButton
            size="small"
            edge="start"
            aria-label="sign out"
            onClick={signOut}
          >
            <IoMdExit size={30} color={gray[400]} />
          </IconButton>
        </Stack>
      </Box>
    </Drawer>
  );
};
