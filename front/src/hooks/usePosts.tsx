import { useQuery } from "@tanstack/react-query";
import { Post, User } from "@/types";
import { posts as postsData } from "@/data/posts";

export const usePosts = (userId?: User["id"]) => {
  // TODO: will fetch a consistent amount of posts, and have a fetch to fetch the nexts posts

  const fetchPosts = async (userId?: User["id"]): Promise<Post[] | null> => {
    // TODO: Fetch posts from the API
    // INPUT: optional userId
    // OUTPUT: posts
    // ERRORS: "User not found", "Unknow error"
    return userId
      ? postsData.filter((post) => post.user.id === userId)
      : postsData;
  };

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", userId],
    queryFn: () => fetchPosts(userId),
  });

  return {
    posts,
    isLoading,
  };
};
