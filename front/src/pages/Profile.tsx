import AvatarUpload from "@/components/AvatarUpload";
import { DEFAULT_USER_IMAGE, useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useProfile } from "@/hooks/useProfile";
import { User } from "@/types";
import { usePosts } from "@/hooks/usePosts";

const Profile = () => {
  const { user } = useUser();
  const { id } = useParams({ strict: false });
  const { profile, updateProfile, updateError, refetchProfile } =
    useProfile(id);
  const { posts, isLoading } = usePosts(profile?.id);

  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState<User["image"] | null>(null);
  const [newUsername, setNewUsername] = useState<User["username"] | null>(null);

  const navigate = useNavigate();

  const isSelf = profile?.id === user?.id;

  useEffect(() => {
    if (!id && user) {
      navigate({
        to: `/profile/${user.id}`,
      });
    }
  }, [user, id, navigate]);

  if (!user || !profile)
    return <Typography variant="h5">User not found</Typography>;

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
          image={newImage ?? profile.image ?? DEFAULT_USER_IMAGE}
          setImage={isEditing ? setNewImage : undefined}
          size={120}
          displayOnly={!isEditing}
        />
      </div>

      {isEditing ? (
        <TextField
          fullWidth
          label="Username"
          value={newUsername ?? user.username}
          onChange={(e) => setNewUsername(e.target.value)}
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
          {profile.username}
        </Typography>
      )}

      <Typography variant="subtitle1">{profile.email}</Typography>

      {updateError && <Typography color="error">{updateError}</Typography>}

      {isSelf ? (
        isEditing ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              updateProfile(
                {
                  id: user.id,
                  username: newUsername,
                  image: newImage,
                },
                {
                  onSuccess: () => {
                    refetchProfile();
                    setIsEditing(false);
                  },
                }
              );
            }}
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
        )
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate({
              to: `/chat/${profile.id}`,
            });
          }}
          style={{ marginTop: 16 }}
        >
          Go to Chat
        </Button>
      )}

      {isLoading && <Typography variant="h5">Loading...</Typography>}
      {posts && posts.map((post) => <div key={post.id}>{post.content}</div>)}
    </div>
  );
};

export default Profile;
