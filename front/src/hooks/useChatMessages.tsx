import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { ChatMessage } from "@/types";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "@/axios/axios";
import { API_ROUTES } from "@/axios/apiRoutes";

const MESSAGES_PER_PAGE = 20;

const useChatMessages = (userId?: string) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !userId) return;

    const newSocket = io(import.meta.env.VITE_API_URL);
    setSocket(newSocket);

    newSocket.emit("join", { userId: user.id, otherUserId: userId });

    newSocket.on("receiveMessage", (_message: { message: string }) => {
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, userId]);

  const fetchMessages = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<ChatMessage[]> => {
    const { data } = await api.get<ChatMessage[]>(
      `${API_ROUTES.chatMessage}/${userId}`,
      { params: { page: pageParam, limit: MESSAGES_PER_PAGE } }
    );
    return data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["chatMessages", userId],
      queryFn: ({ pageParam }) => fetchMessages({ pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length < MESSAGES_PER_PAGE ? undefined : allPages.length + 1,
    });

  const resetQuery = async () => {
    queryClient.removeQueries({ queryKey: ["chatMessages", userId] });
  };

  const sendMessage = async (
    message: ChatMessage["message"]
  ): Promise<ChatMessage | undefined> => {
    try {
      const { data } = await api.post<ChatMessage>(
        `${API_ROUTES.chatMessage}`,
        { message: message, otherUser: userId }
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessageMutation = useMutation({
    mutationFn: (message: ChatMessage["message"]) => sendMessage(message),
    onSuccess: async (chatMessage: ChatMessage | undefined) => {
      if (!socket || !user || !userId || !chatMessage) return;
      await socket.emit("sendMessage", {
        senderId: user.id,
        receiverId: userId,
        message: chatMessage.message,
      });
      resetQuery();
    },
  });

  return {
    messages: data?.pages.flat() || [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sendMessage: sendMessageMutation.mutate,
    resetQuery,
    unreadCount,
    resetReadCount: () => setUnreadCount(0),
  };
};

export default useChatMessages;
