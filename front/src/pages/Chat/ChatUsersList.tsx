import Loader from "@/components/Loader";
import useChatUsers from "@/hooks/useChatUsers";
import ChatUserItem from "@/pages/Chat/ChatUserItem";
import { List, Paper } from "@mui/material";
import { useEffect } from "react";

interface IChatUsersListProps {
  selectedUserId: string;
}

const ChatUsersList = (props: IChatUsersListProps) => {
  const { chatUsers, clearUnreadCount, isLoading } = useChatUsers();

  useEffect(() => {
    if (
      props.selectedUserId &&
      chatUsers.some(
        (user) => user.id === props.selectedUserId && user.unreadCount !== 0
      )
    )
      clearUnreadCount(props.selectedUserId);
  }, [props.selectedUserId, clearUnreadCount]);
  return (
    <Paper
      sx={{
        width: "100%",
        marginTop: "calc(2vh + 35px)",
        borderRight: "1px solid #ddd",
        overflowY: "auto",
        backgroundColor: "#e2e0e0",
      }}
    >
      <Loader isLoading={isLoading} />
      <List>
        {chatUsers
          .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime())
          .map((chatUser) => (
            <ChatUserItem
              key={chatUser.userId}
              chatUser={chatUser}
              isSelected={chatUser.userId === props.selectedUserId}
            />
          ))}
      </List>
    </Paper>
  );
};

export default ChatUsersList;
