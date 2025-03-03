import { useState, useEffect } from "react";
import { ChatUser } from "@/types";
import { aviciiUser, chrisUser, idoUser, testUser } from "@/data/users";
import { useUser } from "@/hooks/useUser";
import { io } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";

const SOCKET_SERVER_URL = "http://localhost:6567"; // I am lazy, this needs env

const useChatUsers = () => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_SERVER_URL);
    socket.emit("join", { userId: user.id });

    socket.on(
      "receiveMessage",
      (chatMessage: { message: string; senderId: string }) => {
        setChatUsers((prev) =>
          prev.map((chatUser) =>
            chatUser.id === chatMessage.senderId
              ? ({
                  ...chatUser,
                  unreadCount: chatUser.unreadCount + 1,
                  lastMessage: chatMessage.message,
                  dateTime: new Date(),
                } as ChatUser)
              : chatUser
          )
        );
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const fetchChatUsers = async (): Promise<ChatUser[] | null> => {
    // TODO: Fetch chat users
    // INPUT: none
    // OUTPUT: chatUsers
    // ERRORS: "User not found", "Unknow error"
    return [
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
    ];
  };

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchChatUsers(),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data) setChatUsers(data);
  }, [data]);

  const clearUnreadCount = (selectedUserId: ChatUser["id"]) => {
    setChatUsers((prev) =>
      prev.map((chatUser) =>
        chatUser.id === selectedUserId
          ? ({
              ...chatUser,
              unreadCount: 0,
            } as ChatUser)
          : chatUser
      )
    );
  };

  return { chatUsers, clearUnreadCount, isLoading };
};

export default useChatUsers;
