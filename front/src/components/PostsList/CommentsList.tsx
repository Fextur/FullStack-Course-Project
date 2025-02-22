import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import { Post } from "../../types";
import { useComments } from "@/hooks/useComments";
import CommentItem from "@/components/PostsList/CommentItem";
import { useUser } from "@/hooks/useUser";
import { Send } from "lucide-react";

const CommentsList = ({
  postId,
  expandComments,
}: {
  postId: Post["id"];
  expandComments: (number: Post["commentsCount"]) => void;
}) => {
  const { user } = useUser();
  const parentRef = useRef<HTMLDivElement | null>(null);
  const {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    addComment,
  } = useComments(postId);
  const [commentContent, setCommentContent] = useState("");

  const rowVirtualizer = useVirtualizer({
    count: comments.length + (hasNextPage ? 2 : 1),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 6,
  });

  useEffect(() => {
    expandComments(comments.length + (hasNextPage ? 2 : 1));
  }, [comments, hasNextPage]);

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
          const specialRow = virtualItem.index + 1 > comments.length;
          const comment = comments[virtualItem.index];
          return (
            <div
              key={virtualItem.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <List sx={{ width: "100%" }}>
                {specialRow ? (
                  hasNextPage && virtualItem.index === comments.length ? (
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => !isFetchingNextPage && fetchNextPage()}
                      >
                        <ListItemText primary={"... Load more comments"} />
                      </ListItemButton>
                    </ListItem>
                  ) : (
                    user !== null && (
                      <ListItem disablePadding>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            paddingRight: 1,
                          }}
                        >
                          <Avatar src={user.image} sx={{ marginRight: 1 }} />
                          <TextField
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="Write a comment..."
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                          <IconButton
                            color="primary"
                            sx={{ marginLeft: 1 }}
                            onClick={() => {
                              if (!commentContent.trim()) return;
                              addComment(commentContent);
                              setCommentContent("");
                            }}
                          >
                            <Send size={20} />
                          </IconButton>
                        </Box>
                      </ListItem>
                    )
                  )
                ) : (
                  comment && <CommentItem comment={comment} key={comment.id} />
                )}
              </List>
            </div>
          );
        })}
      </div>
    </Box>
  );
};

export default CommentsList;
