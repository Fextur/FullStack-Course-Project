import { Avatar, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { Comment } from "@/types";

const CommentItem = ({ comment }: { comment: Comment }) => {
  const navigate = useNavigate();

  return (
    <ListItem disablePadding>
      <ListItemIcon
        onClick={() =>
          navigate({
            to: `/profile/${comment.user.id}`,
          })
        }
        sx={{
          cursor: "pointer",
          paddingRight: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Avatar src={comment.user.image} />
        <ListItemText secondary={comment.user.username} />
      </ListItemIcon>
      <ListItemText primary={comment.content} />
    </ListItem>
  );
};

export default CommentItem;
