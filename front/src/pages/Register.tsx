import { useRegister } from "@/hooks/useRegister";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { TextField, Button, Typography, Paper, Avatar } from "@mui/material";
import { Camera, UserPlus } from "lucide-react";
import { useState } from "react";
import { DEFAULT_USER_IMAGE } from "@/hooks/useUser";

const Register = () => {
  const { register, isRegistering, registerError } = useRegister();
  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [image, setImage] = useState<string>(DEFAULT_USER_IMAGE);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  const form = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      register(
        { ...value, image },
        {
          onSuccess: () => navigate({ to: "/" }),
          onError: (error) => {
            if (error.message.includes("Username is already taken")) {
              setUsernameError("Username is already taken");
            } else if (error.message.includes("Email is already in use")) {
              setEmailError("Email is already in use");
            }
          },
        }
      );
    },
  });

  return (
    <Paper
      elevation={3}
      sx={{ padding: 4, maxWidth: 400, margin: "auto", mt: 8 }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
      >
        <UserPlus size={24} />
        Register
      </Typography>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <label
          htmlFor="image-upload"
          style={{ cursor: "pointer", position: "relative" }}
        >
          <Avatar
            src={image}
            style={{
              width: 90,
              height: 90,
              cursor: "pointer",
              border: "3px solid #ccc",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.filter = "brightness(0.7)")
            }
            onMouseOut={(e) => (e.currentTarget.style.filter = "brightness(1)")}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "rgba(0, 0, 0, 0.7)",
              borderRadius: "50%",
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Camera width={18} height={18} color="white" />
          </div>
        </label>
      </div>

      <input
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              setEmailError("");
              return !value
                ? "Email is required"
                : !/^\S+@\S+\.\S+$/.test(value)
                ? "Invalid email format"
                : undefined;
            },
          }}
        >
          {(field) => (
            <TextField
              fullWidth
              label="Email"
              onChange={(e) => field.handleChange(e.target.value)}
              error={!!field.state.meta.errors?.length || !!emailError}
              helperText={field.state.meta.errors?.[0] || emailError || ""}
              sx={{ mt: 2 }}
            />
          )}
        </form.Field>

        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) => {
              setUsernameError("");
              return !value ? "Username is required" : undefined;
            },
          }}
        >
          {(field) => (
            <TextField
              fullWidth
              label="Username"
              onChange={(e) => field.handleChange(e.target.value)}
              error={!!field.state.meta.errors?.length || !!usernameError}
              helperText={field.state.meta.errors?.[0] || usernameError || ""}
              sx={{ mt: 2 }}
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
