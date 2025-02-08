import AvatarUpload from "@/components/AvatarUpload";
import { DEFAULT_USER_IMAGE, useUser } from "@/hooks/useUser";
import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";

const Profile = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [image, setImage] = useState(user?.image || DEFAULT_USER_IMAGE);

  if (!user) return <Typography variant="h5">User not found</Typography>;

  return (
    <div
      style={{
        margin: "auto",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <AvatarUpload
          image={image}
          setImage={isEditing ? setNewImage : undefined}
          size={120}
          displayOnly={!isEditing}
        />
      </div>

      {isEditing ? (
        <TextField
          fullWidth
          label="Username"
          value={user.username}
          autoFocus
          sx={{
            marginTop: 2,
            width: "20%",
            minWidth: 200,
            maxWidth: 400,
            color: "white",
            "& .MuiInputBase-input": { color: "white" },
            "& .MuiInputLabel-root": { color: "white" },
          }}
        />
      ) : (
        <Typography variant="h4" style={{ marginTop: 16 }}>
          {user.username}
        </Typography>
      )}

      <Typography variant="subtitle1">{user.email}</Typography>

      {isEditing ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditing(false)}
          style={{ marginTop: 16 }}
        >
          Save Changes
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditing(true)}
          style={{ marginTop: 16 }}
        >
          Edit Profile
        </Button>
      )}
    </div>
  );
};

export default Profile;
