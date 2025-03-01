import { ChatUser } from "@/types";
import {
  Avatar,
  Badge,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";

interface ChatUserItemProps {
  chatUser: ChatUser;
  isSelected: boolean;
}

const ChatUserItem = (props: ChatUserItemProps) => {
  const navigate = useNavigate();

  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={props.isSelected}
        onClick={() => navigate({ to: `/chat/${props.chatUser.id}` })}
        sx={{
          "&.Mui-selected": {
            backgroundColor: "rgba(68, 68, 68, 0.77)",
            ":hover": { backgroundColor: "rgba(68, 68, 68, 0.87)" },
          },
          ":hover": { backgroundColor: "rgba(68, 68, 68, 0.07)" },
        }}
      >
        <ListItemAvatar>
          <Badge
            color="primary"
            badgeContent={props.chatUser.unreadCount}
            overlap="circular"
          >
            <Avatar src={props.chatUser.image} />
          </Badge>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="body1"
                fontWeight={props.isSelected ? "bold" : "normal"}
              >
                {props.chatUser.username}
              </Typography>
              <Typography
                variant="caption"
                color={props.isSelected ? "white" : "gray"}
              >
                {format(new Date(props.chatUser.dateTime), "hh:mm a")}
              </Typography>
            </Box>
          }
          secondary={
            <Typography
              variant="body2"
              color={props.isSelected ? "white" : "textSecondary"}
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {props.chatUser.lastMessage}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default ChatUserItem;
