import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { NewPost, Post, User } from "@/types";
import { posts as postsData } from "@/data/posts";
import axios from "axios";

const POSTS_PER_PAGE = 40;
const BASE_URL: string = import.meta.env.VITE_BASE_URL;

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

  const createPost = async (userId: string, content: string, image: string) => {
    try {//TODO:use userId with JWT
      const { data } = await axios.post(
        `${BASE_URL}/api/posts`,
        { content, image },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("An unexpected error occurred");
    }
  };

  const updatePost = async (postId: string, content: string, image: string) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/posts/${postId}`,
        { content, image },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("An unexpected error occurred");
    }
  };

  const createPostMutation = useMutation({
    mutationFn: ({
      userId,
      content,
      image,
    }: {
      userId: string;
      content: string;
      image: string;
    }) => createPost(userId, content, image),
  });

  const updatePostMutation = useMutation({
    mutationFn: ({
      postId,
      content,
      image,
    }: {
      postId: string;
      content: string;
      image: string;
    }) => updatePost(postId, content, image),
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", userId],
      queryFn: ({ pageParam }) => fetchPosts({ pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length < POSTS_PER_PAGE ? undefined : allPages.length + 1,
    });

  return {
    createPostMutation,
    updatePostMutation,
    posts: data?.pages.flat() || [],
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
