import { useState, useEffect } from "react";
import { ChatUser } from "@/types";
import { aviciiUser, chrisUser, idoUser, testUser } from "@/data/users";
import { useUser } from "@/hooks/useUser";

const useChatUsers = () => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const { user } = useUser();

  useEffect(() => {
    setChatUsers([
      {
        ...idoUser,
        lastMessage: "Hey!",
        unreadCount: 2,
        dateTime: new Date(),
      },
      {
        ...chrisUser,
        lastMessage: "hello world",
        unreadCount: 0,
        dateTime: new Date(),
      },
      {
        ...aviciiUser,
        lastMessage: "fuck",
        unreadCount: 5,
        dateTime: new Date(),
      },
      {
        ...testUser,
        lastMessage:
          "fucasdsadasdasdasdasdasdasdaadadsadadadasdasdasdasdadasdgdfgsdfgsdfgsdfsfdsfsfdsfdsfdsfdsfdsfdsfds",
        unreadCount: 8,
        dateTime: new Date(),
      },
    ]);
  }, []);

  return { chatUsers };
};

export default useChatUsers;
