import ChatMessagesView from "@/pages/Chat/ChatMessagesView";
import ChatUsersList from "@/pages/Chat/ChatUsersList";
import { useParams } from "@tanstack/react-router";

const Chat = () => {
  const { id } = useParams({ strict: false });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div style={{ width: "25%", height: "100%" }}>
        <ChatUsersList selectedUserId={id} />
      </div>
      <div style={{ width: "75%", height: "100%" }}>
        <ChatMessagesView selectedUserId={id} />
      </div>
    </div>
  );
};

export default Chat;
