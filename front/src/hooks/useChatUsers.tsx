import { useState, useEffect } from "react";
import { ChatUser } from "@/types";
import { useUser } from "@/hooks/useUser";
import { io } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/axios/apiRoutes";
import api from "@/axios/axios";

const useChatUsers = () => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const socket = io(import.meta.env.VITE_API_URL);
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

  const fetchChatUsers = async (): Promise<ChatUser[] | undefined> => {
    if (user) {
      const { data } = await api.get(`${API_ROUTES.users}/chat/${user?.id}`);
      return data;
    }
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
