import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Comment, Post } from "@/types";
import { usePosts } from "@/hooks/usePosts";
import { generateComments } from "@/data/comments";
import { useUser } from "@/hooks/useUser";

const COMMENTS_PER_PAGE = 5;

export const useComments = (postId: Post["id"]) => {
  /// TODO: needs to be sure the refetch on addComment is working
  const { posts } = usePosts();
  const { user } = useUser();

  const fetchComments = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<Comment[]> => {
    // TODO: Fetch comments from the API
    // INPUT:  pageParam
    // OUTPUT: comments
    // ERRORS: "Post not found", "Unknow error"

    const startIndex = (pageParam - 1) * COMMENTS_PER_PAGE;
    const paginatedComments = generateComments(
      posts.find((post) => post.id === postId)?.commentsCount || 0
    ).slice(startIndex, startIndex + COMMENTS_PER_PAGE);

    return paginatedComments;
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
      lastPage.length < COMMENTS_PER_PAGE ? undefined : allPages.length + 1,
  });

  const addComment = async (
    content: Comment["content"]
  ): Promise<Comment | null> => {
    return new Promise<Comment | null>((resolve, _reject) => {
      // TODO: creates comment
      // INPUT: content
      // OUTPUT: Comment
      // ERRORS: "Others"
      if (user) resolve({ id: "999", content, user });
      else resolve(null);
    });
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
