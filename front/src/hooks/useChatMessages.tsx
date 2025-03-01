import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { generateMessage } from "@/data/messages";
import { useUser } from "@/hooks/useUser";
import { ChatMessage } from "@/types";

const MESSAGES_PER_PAGE = 20;

const useChatMessages = (userId?: string) => {
  const { user } = useUser();
  const allMessages = user && userId ? generateMessage(user.id, userId) : [];
  const queryClient = useQueryClient();

  const fetchMessages = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<ChatMessage[]> => {
    // console.log("fetchMessages", pageParam);
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
    queryClient.removeQueries({ queryKey: ["chatMessages", userId] }); // Remove old pages
    //  await refetch();
  };
  return {
    messages: data?.pages.flat() || [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sendMessage: async (message: string) => {},
    resetQuery,
    unreadCount: 5,
  };
};

export default useChatMessages;
