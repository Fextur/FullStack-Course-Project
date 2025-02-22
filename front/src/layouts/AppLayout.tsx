import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import {
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import { ArrowLeft, Home, LogIn, MessageCircle } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";

const AppLayout = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const router = useRouter();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [refreshKey, setRefreshKey] = useState(0);
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
          <div
            style={{
              display: "flex",
              gap: 15,
            }}
          >
            <Button
              sx={{ color: "white" }}
              startIcon={<Home size={20} />}
              onClick={() => {
                if (window.location.pathname === "/") {
                  setRefreshKey((prev) => prev + 1);
                } else {
                  navigate({ to: "/" });
                }
              }}
            >
              Home
            </Button>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ bgcolor: "white", height: "24px", alignSelf: "center" }}
            />
            <Button
              sx={{ color: "white" }}
              startIcon={<MessageCircle size={20} />}
              onClick={() => navigate({ to: "/chat" })}
            >
              Chats
            </Button>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ bgcolor: "white", height: "24px", alignSelf: "center" }}
            />
            <Button
              sx={{ color: "white" }}
              startIcon={<Home size={20} />}
              onClick={() => navigate({ to: "/post" })}
            >
              New Post
            </Button>
          </div>
          {user ? (
            <>
              <Avatar
                src={user.image}
                alt={user.username}
                sx={{ width: 40, height: 40, marginRight: 2 }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                style={{ cursor: "pointer" }}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
              >
                <MenuItem
                  onClick={() => {
                    navigate({
                      to: `/profile`,
                    });
                    closeMenu();
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
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
      {location.pathname !== "/login" && location.pathname !== "/" && (
        <IconButton
          onClick={() => {
            router.history.go(-1);
          }}
          sx={{
            position: "absolute",
            top: "11vh",
            left: "16px",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            borderRadius: "50%",
            padding: "8px",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.9)" },
          }}
        >
          <ArrowLeft size={24} />
        </IconButton>
      )}
      <div
        style={{
          width: "100%",
          height: "90vh",
          overflow: "auto",
          padding: "16px",
        }}
      >
        <Outlet key={refreshKey} />
      </div>
    </div>
  );
};

export default AppLayout;
