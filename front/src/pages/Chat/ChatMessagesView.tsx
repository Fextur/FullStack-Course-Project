import Loader from "@/components/Loader";
import useChatMessages from "@/hooks/useChatMessages";
import { useProfile } from "@/hooks/useProfile";
import {
  Avatar,
  Badge,
  Box,
  Fab,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IChatMessagesViewProps {
  selectedUserId: string;
}

const ChatMessagesView = (props: IChatMessagesViewProps) => {
  const {
    messages,
    fetchNextPage,
    sendMessage,
    hasNextPage,
    isFetchingNextPage,
    resetQuery,
    unreadCount,
    resetReadCount,
  } = useChatMessages(props.selectedUserId);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const { profile: chatUser } = useProfile(props.selectedUserId);
  const [atBottom, setAtBottom] = useState(true);
  const navigate = useNavigate();

  const rowVirtualizer = useVirtualizer({
    count: messages.length + 1,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const message = messages[index]?.message || "";
      const maxCharsPerLine = 145;
      const lineCount = Math.ceil(message.length / maxCharsPerLine);
      const baseHeight = 50;
      const lineHeight = 20;

      return baseHeight + Math.max(0, lineCount - 1) * lineHeight;
    },
    overscan: 20,
  });

  useEffect(() => {
    const lastItem = [...rowVirtualizer.getVirtualItems()].pop();
    if (!lastItem) return;

    if (
      lastItem.index >= messages.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    messages.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  const handleSend = () => {
    if (parentRef.current) {
      rowVirtualizer.scrollToIndex(0);
      resetQuery();
      setAtBottom(true);
    }
    if (!messageContent.trim()) return;
    sendMessage(messageContent);
    setMessageContent("");
  };

  useEffect(() => {
    if (parentRef.current) {
      const handleScroll = (e: WheelEvent) => {
        e.preventDefault();
        const currentTarget = e.currentTarget as HTMLElement;

        if (currentTarget) {
          currentTarget.scrollTop -= e.deltaY;
          setAtBottom(currentTarget.scrollTop < 20);
        }
      };
      parentRef.current?.addEventListener("wheel", handleScroll, {
        passive: false,
      });
      return () => {
        parentRef.current?.removeEventListener("wheel", handleScroll);
      };
    }
  }, [parentRef.current]);

  useEffect(() => {
    rowVirtualizer.scrollToIndex(0, { behavior: "auto", align: "start" });

    setAtBottom(true);
  }, [rowVirtualizer, props.selectedUserId]);

  useEffect(() => {
    if (unreadCount !== 0 && atBottom) {
      resetReadCount();
      resetQuery();
    }
  }, [unreadCount, atBottom]);
  return !props.selectedUserId || !chatUser ? null : (
    <Paper
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          borderBottom: "1px solid #ddd",
          position: "sticky",
          top: 0,
          backgroundColor: "#e2e0e0",
          zIndex: 2,
          cursor: "pointer",
        }}
        onClick={() =>
          navigate({
            to: `/profile/${chatUser.id}`,
          })
        }
      >
        <Avatar src={chatUser.image} sx={{ marginRight: 2 }} />
        <Typography variant="h6">{chatUser.username}</Typography>
      </Box>

      <Box
        ref={parentRef}
        sx={{
          overflowY: "auto",
          height: "100%",
          width: "100%",
          transform: "scaleY(-1)",
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
            const chatMessage = messages[virtualItem.index];
            const isLoaderRow = virtualItem.index >= messages.length;
            return (
              <Box
                key={virtualItem.index}
                sx={{
                  position: "absolute",
                  top: 0,
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px) scaleY(-1)`,
                  width: "100%",
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
                        height: "100%",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      {!atBottom && (
                        <Typography color="grey">No More Messages</Typography>
                      )}
                    </Box>
                  )
                ) : (
                  <Box
                    sx={{
                      left:
                        chatMessage.senderId === props.selectedUserId ? 0 : "auto",
                      right:
                        chatMessage.senderId === props.selectedUserId ? "auto" : 0,
                      maxWidth: "75%",
                      padding: 1,
                      position: "absolute",
                      marginLeft: 1,
                      marginRight: 1,
                      backgroundColor:
                        chatMessage.senderId === props.selectedUserId
                          ? "#E0E0E0"
                          : "#D1E8FF",
                      borderRadius: 2,
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      width: "fit-content",
                      "&::after":
                        virtualItem.index === 0 ||
                        messages[virtualItem.index - 1].senderId !== chatMessage.senderId
                          ? {
                              content: "''",
                              position: "absolute",
                              bottom: "-15px",
                              left:
                                chatMessage.senderId === props.selectedUserId
                                  ? "15px"
                                  : "auto",
                              right:
                                chatMessage.senderId === props.selectedUserId
                                  ? "auto"
                                  : "15px",
                              borderWidth: "8px",
                              borderStyle: "solid",
                              borderColor:
                                chatMessage.senderId === props.selectedUserId
                                  ? "#E0E0E0 transparent transparent transparent"
                                  : "#D1E8FF transparent transparent transparent",
                            }
                          : {},
                    }}
                  >
                    <Typography>{chatMessage.message}</Typography>
                  </Box>
                )}
              </Box>
            );
          })}
        </div>
      </Box>
      {!atBottom && (
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            position: "absolute",
            bottom: 80,
            right: 20,
            "& .MuiBadge-badge": {
              transform: "scale(1) translate(25%, -25%)",
              zIndex: 4,
            },
          }}
        >
          <Fab
            color="primary"
            onClick={() => {
              rowVirtualizer.scrollToIndex(0);
              setAtBottom(true);
            }}
            sx={{ zIndex: 3 }}
          >
            <ArrowDown size={24} />
          </Fab>
        </Badge>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          borderTop: "1px solid #ddd",
          position: "sticky",
          bottom: 0,
          backgroundColor: "white",
          zIndex: 2,
        }}
      >
        <TextField
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Write a message..."
          variant="outlined"
          size="small"
          fullWidth
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <IconButton color="primary" sx={{ marginLeft: 1 }} onClick={handleSend}>
          <Send size={20} />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatMessagesView;
