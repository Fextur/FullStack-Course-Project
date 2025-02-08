import {
    Avatar,
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    IconButton,
    Typography,
  } from "@mui/material";
  import { useVirtualizer } from "@tanstack/react-virtual";
  import { Heart, MessageCircle } from "lucide-react";
  import { useRef } from "react";
  import { Post } from "../types";
  
  const PostsList = ({posts}:{posts:Post[]}) =>{
    const parentRef = useRef<HTMLDivElement | null>(null);

    const rowVirtualizer = useVirtualizer({
      count: posts.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 400,
      overscan: 5,
    });


return ( <Box
    ref={parentRef}
    style={{
      width: "100%",
      height: "100%",
      overflowY: "auto",
      justifyItems: "center",
      msOverflowStyle: "none",
    }}
  >
    {rowVirtualizer.getVirtualItems().map((virtualItem) => {
      const post = posts[virtualItem.index];
      if (!post) return null;

      return (
        <Card
          key={post.id}
          sx={{
            margin: 5,
            width: "50vw",
          }}
        >
          <CardHeader
            avatar={<Avatar src={post.user.image} />}
            title={post.user.username}
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
            >
              <Heart />
            </IconButton>
            <Typography color="grey">{post.likes}</Typography>
            <IconButton
              sx={{ outline: "none", "&:focus": { outline: "none" } }}
            >
              <MessageCircle />
            </IconButton>
            <Typography color="grey">{post.comments.length}</Typography>
          </CardActions>
        </Card>
      );
    })}
  </Box>)
}

export default PostsList