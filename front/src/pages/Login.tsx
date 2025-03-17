import { useForm } from "@tanstack/react-form";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "@tanstack/react-router";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { User } from "lucide-react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

const Login = () => {
  const [isGoogleErrorShown, setIsGoogleErrorShown] = useState(false);
  const { login, isLoggingIn, loginError, loginGoogle } = useUser();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      login(value, {
        onSuccess: () => navigate({ to: "/" }),
      });
    },
  });

  const handleSuccessLogin = async (credentialResponse: CredentialResponse) => {
    loginGoogle(
      { credential: credentialResponse.credential },
      {
        onSuccess: () => navigate({ to: "/" }),
      }
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 4, maxWidth: 400, margin: "auto", mt: 8 }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
      >
        <User size={24} />
        Login
      </Typography>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) =>
              !value ? "Username is required" : undefined,
          }}
        >
          {(field) => (
            <TextField
              fullWidth
              label="Username"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              error={!!field.state.meta.errors?.length || !!loginError}
              helperText={field.state.meta.errors?.[0] || ""}
              sx={{ mb: 2 }}
            />
          )}
        </form.Field>
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              !value ? "Password is required" : undefined,
          }}
        >
          {(field) => (
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              error={!!field.state.meta.errors?.length || !!loginError}
              helperText={field.state.meta.errors?.[0] || ""}
              sx={{ mb: 2 }}
            />
          )}
        </form.Field>
        {loginError && <Typography color="error">{loginError}</Typography>}
        <Button
          loading={isLoggingIn}
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoggingIn}
          sx={{ mt: 1, mb: 2 }}
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </Button>
        <GoogleLogin
          width={100}
          onSuccess={handleSuccessLogin}
          onError={() => setIsGoogleErrorShown(true)}
        />
        {isGoogleErrorShown && (
          <Typography fontSize={15} color="error">
            Error logging in via Google
          </Typography>
        )}
        <Button
          fullWidth
          variant="text"
          sx={{ mt: 1 }}
          onClick={() => navigate({ to: "/register" })}
        >
          Don't have an account? Register
        </Button>
      </form>
    </Paper>
  );
};

export default Login;
