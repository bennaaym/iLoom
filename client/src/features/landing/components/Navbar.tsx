"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { brand } from "@/common/theme";
import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";

const pages = [
  {
    label: "features",
    href: "#features",
  },
  {
    label: "team",
    href: "#team",
  },
];

export const Navbar = () => {
  const router = useRouter();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const scroll = (page: (typeof pages)[number]) => {
    document.getElementById(page.href.replace("#", ""))?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "rgba(0,0,0,0)",
        color: brand[400],
        m: 0,
        p: 0,
        height: 0,
      }}
      elevation={0}
    >
      <Toolbar sx={{ height: 0 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100vw"
          bgcolor="transparent"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="70%"
            boxShadow={1}
            px={4}
            bgcolor="white"
            sx={{
              borderBottomLeftRadius: "5px",
              borderBottomRightRadius: "5px",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 4,
                display: { xs: "none", md: "flex" },
                fontFamily: "Quicksand",
                fontWeight: 800,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                fontSize: 32,
              }}
            >
              iLoom
            </Typography>

            <Box
              sx={{
                display: { xs: "flex", md: "none" },
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.label}
                    onClick={() => {
                      scroll(page);
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: brand[400],
                        textTransform: "capitalize",
                        fontWeight: 500,
                      }}
                    >
                      {page.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "Quicksand",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                fontSize: 32,
              }}
            >
              iLoom
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex", gap: 4 },
              }}
              mt={1}
            >
              {pages.map((page) => (
                <Button
                  key={page.label}
                  onClick={() => {
                    scroll(page);
                    handleCloseNavMenu();
                  }}
                  sx={{
                    color: brand[400],
                    display: "block",
                    "&:hover": {
                      bgcolor: brand[400],
                      color: "white",
                      borderRadius: "5px",
                    },
                    textTransform: "capitalize",
                    fontWeight: 500,
                    fontSize: 18,
                  }}
                >
                  {page.label}
                </Button>
              ))}
            </Box>
            <Button
              variant="contained"
              sx={{
                my: 2,
                textTransform: "capitalize",
                width: "fit-content",
                borderRadius: "5px",
                boxShadow: "none",
                bgcolor: "primary",
                fontWeight: 800,
                // fontSize: 18,

                "&:hover": {
                  bgcolor: brand[400],
                  opacity: 0.9,
                },
              }}
              onClick={() => router.push("/auth/sign-in")}
            >
              sign in
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
