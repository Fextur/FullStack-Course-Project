import { useInfiniteQuery } from "@tanstack/react-query";
import { Post, User } from "@/types";
import { posts as postsData } from "@/data/posts";

const POSTS_PER_PAGE = 40;

export const usePosts = (userId?: User["id"]) => {
  const fetchPosts = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<Post[]> => {
    // TODO: Fetch posts from the API
    // INPUT: optional userId, pageParam
    // OUTPUT: posts
    // ERRORS: "User not found", "Unknow error"
    const allPosts = userId
      ? postsData.filter((post) => post.user.id === userId)
      : postsData;

    const startIndex = (pageParam - 1) * POSTS_PER_PAGE;
    const paginatedPosts = allPosts.slice(
      startIndex,
      startIndex + POSTS_PER_PAGE
    );

    return paginatedPosts;
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", userId],
      queryFn: ({ pageParam }) => fetchPosts({ pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length < POSTS_PER_PAGE ? undefined : allPages.length + 1,
    });

  return {
    posts: data?.pages.flat() || [],
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
