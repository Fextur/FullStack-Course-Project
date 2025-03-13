import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Comment, Post } from "@/types";
import api from "@/axios/axios";
import { API_ROUTES } from "@/axios/apiRoutes";

const COMMENTS_PER_PAGE = 5;

export const useComments = (postId: Post["id"]) => {
  /// TODO: needs to be sure the refetch on addComment is working

  const fetchComments = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<Comment[] | undefined> => {
    try {
      const { data } = await api.get(`${API_ROUTES.comments}/${postId}`, {
        params: { page: pageParam, limit: COMMENTS_PER_PAGE },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) => fetchComments({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage && lastPage.length < COMMENTS_PER_PAGE
        ? undefined
        : allPages.length + 1,
  });

  const addComment = async (
    content: Comment["content"]
  ): Promise<Comment | undefined> => {
    try {
      const { data } = await api.post<Comment>(API_ROUTES.comments, {
        postId,
        content,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const addCommentMutation = useMutation({
    mutationFn: (content: Comment["content"]) => addComment(content),
    onSuccess: () => {
      refetch();
    },
  });

  return {
    comments: data?.pages.flat() || [],
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    addComment: addCommentMutation.mutate,
    isAdding: addCommentMutation.isPending,
    addingError: addCommentMutation.error
      ? addCommentMutation.error.message
      : null,
  };
};
