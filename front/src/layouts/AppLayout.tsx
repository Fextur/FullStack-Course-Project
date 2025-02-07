import { Link, Outlet } from "@tanstack/react-router";
import { AppBar, Toolbar, Button } from "@mui/material";
import { Home, LogIn } from "lucide-react";

const AppLayout = () => {
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
          <Button
            component={Link}
            to="/login"
            sx={{ color: "white" }}
            startIcon={<LogIn size={20} />}
          >
            Login
          </Button>
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
