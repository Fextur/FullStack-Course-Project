import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { generateMessage } from "@/data/messages";
import { useUser } from "@/hooks/useUser";
import { ChatMessage } from "@/types";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const MESSAGES_PER_PAGE = 20;
const SOCKET_SERVER_URL = "http://localhost:6565";

const useChatMessages = (userId?: string) => {
  const { user } = useUser();
  const allMessages = user && userId ? generateMessage(user.id, userId) : [];
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !userId) return;

    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.emit("join", { userId: user.id, otherUserId: userId });

    newSocket.on("receiveMessage", (message: ChatMessage) => {
      console.log("New Message:", message);
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
    if (!userId || !user) return [];
    const startIndex = (pageParam - 1) * MESSAGES_PER_PAGE;
    return allMessages.slice(startIndex, startIndex + MESSAGES_PER_PAGE);
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
  ): Promise<ChatMessage | null> => {
    return new Promise<ChatMessage | null>((resolve, _reject) => {
      // TODO: sends new message
      // INPUT: message, receiverId
      // OUTPUT: ChatMessage
      // ERRORS: "Others"

      if (!user) return;
      const newMessage: ChatMessage = {
        ...user,
        message,
        dateTime: new Date(),
      };
      if (user) resolve(newMessage);
      else resolve(null);
    });
  };

  const sendMessageMutation = useMutation({
    mutationFn: (message: ChatMessage["message"]) => sendMessage(message),
    onSuccess: async (chatMessage: ChatMessage | null) => {
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
