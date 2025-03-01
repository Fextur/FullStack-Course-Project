import useChatUsers from "@/hooks/useChatUsers";
import ChatUserItem from "@/pages/Chat/ChatUserItem";
import { List, Paper } from "@mui/material";

interface IChatUsersListProps {
  selectedUserId: string;
}

const ChatUsersList = (props: IChatUsersListProps) => {
  const { chatUsers } = useChatUsers();
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
      <List>
        {chatUsers.map((chatUser) => (
          <ChatUserItem
            key={chatUser.id}
            chatUser={chatUser}
            isSelected={chatUser.id === props.selectedUserId}
          />
        ))}
      </List>
    </Paper>
  );
};

export default ChatUsersList;
