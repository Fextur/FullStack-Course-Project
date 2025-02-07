import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { AppBar, Toolbar, Button, Avatar, Menu, MenuItem } from "@mui/material";
import { Home, LogIn } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";

const AppLayout = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const closeMenu = () => setAnchorEl(null);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      <AppBar
        position="static"
        sx={{
          height: "10vh",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "black",
          alignContent: "center",
        }}
      >
        <Toolbar
          sx={{
            width: "98%",
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Button
            component={Link}
            to="/"
            sx={{ color: "white" }}
            startIcon={<Home size={20} />}
          >
            Home
          </Button>
          {user ? (
            <>
              <Avatar
                src={user.image}
                alt={user.username}
                sx={{ width: 40, height: 40, marginRight: 2 }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
              >
                <MenuItem
                  onClick={() => {
                    navigate({ to: "/profile" });
                    closeMenu();
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    // navigate({ to: "/profile" });
                    logout();
                    closeMenu();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              sx={{ color: "white" }}
              startIcon={<LogIn size={20} />}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <div
        style={{
          width: "100%",
          height: "90vh",
          overflow: "auto",
          padding: "16px",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
