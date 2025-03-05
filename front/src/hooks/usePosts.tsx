import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Post, User } from "@/types";
import { posts as postsData } from "@/data/posts";
import api from "@/axios/axios";
import { API_ROUTES } from "@/axios/apiRoutes";
import { useNavigate } from "@tanstack/react-router";

const POSTS_PER_PAGE = 40;

export const usePosts = (userId?: User["id"]) => {
  const navigate = useNavigate();

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

  const createPost = async (content: string, image: string) => {
    try {
      const { data } = await api.post(API_ROUTES.posts, { content, image });
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("An unexpected error occurred");
    }
  };

  const updatePost = async (postId: string, content: string, image: string) => {
    try {
      const { data } = await api.put(`${API_ROUTES.posts}/${postId}`, {
        content,
        image,
      });
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("An unexpected error occurred");
    }
  };

  const createPostMutation = useMutation({
    mutationFn: ({
      content,
      image,
    }: {
      content: string;
      image: string;
    }) => createPost(content, image),
    onSuccess: () => {
      navigate({
        to: "/",
      });
    },
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
    onSuccess: () => {
      navigate({
        to: "/",
      });
    },
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
