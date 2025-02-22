import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { Heart, MessageCircle } from "lucide-react";
import { Post } from "../../types";
import { useNavigate } from "@tanstack/react-router";
import { useLike } from "@/hooks/useLike";
import { useEffect, useState } from "react";
import CommentsList from "@/components/PostsList/CommentsList";

const PostCard = ({
  post,
  expandComments,
}: {
  post: Post;
  expandComments: (number: Post["commentsCount"]) => void;
}) => {
  const navigate = useNavigate();
  const { isLiked, toggleLiked, isUpdating, likedCount } = useLike(post.id);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    return () => {
      expandComments(0);
    };
  }, []);

  return (
    <Card
      sx={{
        padding: 2,
        width: "50vw",
        margin: "20px",
      }}
    >
      <CardHeader
        avatar={<Avatar src={post.user.image} />}
        title={post.user.username}
        onClick={() =>
          navigate({
            to: `/profile/${post.user.id}`,
          })
        }
        sx={{ cursor: "pointer" }}
      />
      <CardMedia
        sx={{ objectFit: "contain" }}
        component="img"
        height="250"
        image={post.image}
      />
      <CardContent>
        <Typography variant="body2" sx={{ direction: "rtl" }}>
          {post.content}
        </Typography>
      </CardContent>
      <CardActions sx={{ direction: "rtl" }}>
        <IconButton
          sx={{ outline: "none", "&:focus": { outline: "none" } }}
          onClick={() => !isUpdating && toggleLiked()}
        >
          {isLiked ? <Heart fill="black" /> : <Heart />}
        </IconButton>
        <Typography color="grey">{likedCount}</Typography>
        <IconButton
          sx={{
            outline: "none",
            "&:focus": { outline: "none" },
            cursor: "pointer",
          }}
          onClick={() => {
            if (showComments) expandComments(0);
            setShowComments(!showComments);
          }}
        >
          <MessageCircle />
        </IconButton>
        <Typography color="grey">{post.commentsCount}</Typography>
      </CardActions>
      {showComments && (
        <CommentsList postId={post.id} expandComments={expandComments} />
      )}
    </Card>
  );
};

export default PostCard;
