import { useRegister } from "@/hooks/useRegister";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { TextField, Button, Typography, Paper } from "@mui/material";

const Register = () => {
  const { register, isRegistering, registerError } = useRegister();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      register(value, {
        onSuccess: () => navigate({ to: "/" }),
      });
    },
  });

  return (
    <Paper
      elevation={3}
      sx={{ padding: 4, maxWidth: 400, margin: "auto", mt: 8 }}
    >
      <Typography variant="h5">Register</Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* Email Field */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "Email is required"
                : !/^\S+@\S+\.\S+$/.test(value)
                ? "Invalid email format"
                : undefined,
          }}
        >
          {(field) => (
            <TextField
              fullWidth
              label="Email"
              onChange={(e) => field.handleChange(e.target.value)}
              error={!!field.state.meta.errors?.length}
              helperText={field.state.meta.errors?.[0] || ""}
              sx={{ mt: 2 }}
            />
          )}
        </form.Field>

        {/* Username Field */}
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
              onChange={(e) => field.handleChange(e.target.value)}
              error={!!field.state.meta.errors?.length}
              helperText={field.state.meta.errors?.[0] || ""}
              sx={{ mt: 2 }}
            />
          )}
        </form.Field>

        {/* Password Field */}
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
              onChange={(e) => field.handleChange(e.target.value)}
              error={!!field.state.meta.errors?.length}
              helperText={field.state.meta.errors?.[0] || ""}
              sx={{ mt: 2 }}
            />
          )}
        </form.Field>

        <form.Field
          name="confirmPassword"
          validators={{
            onChange: ({ value }) => {
              const passwordValue = form.getFieldValue("password");
              console.log("passwordValue", passwordValue);
              console.log("value", value);
              return !value
                ? "Confirm Password is required"
                : value !== passwordValue
                ? "Passwords do not match"
                : undefined;
            },
          }}
        >
          {(field) => (
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              onChange={(e) => field.handleChange(e.target.value)}
              error={!!field.state.meta.errors?.length}
              helperText={field.state.meta.errors?.[0] || ""}
              sx={{ mt: 2 }}
            />
          )}
        </form.Field>

        {registerError && (
          <Typography color="error">{registerError}</Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isRegistering}
        >
          {isRegistering ? "Registering..." : "Register"}
        </Button>
      </form>
    </Paper>
  );
};

export default Register;
