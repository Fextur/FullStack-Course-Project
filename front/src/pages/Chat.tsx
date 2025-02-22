import { useParams } from "@tanstack/react-router";

const Chat = () => {
  const { id } = useParams({ strict: false });

  return <h1>Chat Page{id && ` with ${id}`} </h1>;
};

export default Chat;
