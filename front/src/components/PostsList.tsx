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
import { useEffect, useRef } from "react";
import { Post } from "../types";
import { useNavigate } from "@tanstack/react-router";
import Loader from "@/components/Loader";

const PostsList = ({
  posts,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: {
  posts: Post[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}) => {
  const navigate = useNavigate();
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: posts.length + 1,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 510,
    overscan: 10,
  });

  useEffect(() => {
    const lastItem = [...rowVirtualizer.getVirtualItems()].pop();
    if (!lastItem) return;

    if (
      lastItem.index >= posts.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    posts.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <Box
      ref={parentRef}
      sx={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        justifyItems: "center",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const isLoaderRow = virtualItem.index >= posts.length;
          const post = posts[virtualItem.index];
          return (
            <div
              key={virtualItem.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {isLoaderRow ? (
                hasNextPage ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: 2,
                    }}
                  >
                    <Loader isLoading />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      margin: 2,
                      height: "100%",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Typography color="grey">
                      🚀 You have reached the end of posts!
                    </Typography>
                  </Box>
                )
              ) : (
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
                    >
                      {post.isUserLiked ? <Heart fill="black" /> : <Heart />}
                    </IconButton>
                    <Typography color="grey">{post.likes}</Typography>
                    <IconButton
                      sx={{ outline: "none", "&:focus": { outline: "none" } }}
                    >
                      <MessageCircle />
                    </IconButton>
                    <Typography color="grey">{post.commentsCount}</Typography>
                  </CardActions>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </Box>
  );
};

export default PostsList;
