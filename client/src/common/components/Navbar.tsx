import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Stack,
  Avatar,
} from "@mui/material";
import { IoMdExit } from "react-icons/io";
import { useAuth } from "@/common/providers/AuthProvider";

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ backgroundColor: "primary.main", color: "white", height: "70px" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          fontSize={28}
          fontWeight="bold"
          color="white"
          component="div"
        >
          iLoom.ai
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap={1}
        >
          {user && (
            <Avatar
              sx={{
                width: 30,
                height: 30,
                fontSize: 16,
                fontWeight: "800",
                bgcolor: "white",
                color: "primary.main",
              }}
            >
              {user.name.split(" ").map((value) => value.at(0)?.toUpperCase())}
            </Avatar>
          )}
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="sign out"
            onClick={signOut}
          >
            <IoMdExit size={28} />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
