import { useMutation } from "@tanstack/react-query";
import { Post } from "@/types";
import { usePosts } from "@/hooks/usePosts";
import { useState } from "react";

export const useLike = (postId: Post["id"]) => {
  const { posts } = usePosts();
  const [isLiked, setIsLiked] = useState(
    posts.find((post) => post.id === postId)?.isUserLiked
  );
  const [likedCount, setLikedCount] = useState(
    posts.find((post) => post.id === postId)?.likes
  );

  const toggleLiked = async (): Promise<boolean | null> => {
    return new Promise<boolean | null>((resolve, _reject) => {
      // TODO: Update liked status on that post from my user
      // INPUT: new state
      // OUTPUT: new state
      // ERRORS: "Others"
      resolve(!isLiked);
    });
  };

  const updateLikedMutation = useMutation({
    mutationFn: () => toggleLiked(),
    onSuccess: (newLikedStatus) => {
      if (newLikedStatus !== null) {
        setLikedCount((likedCount ?? 0) + (newLikedStatus ? 1 : -1));
        setIsLiked(newLikedStatus);
      }
    },
  });

  return {
    isLiked,
    toggleLiked: updateLikedMutation.mutate,
    isUpdating: updateLikedMutation.isPending,
    updateError: updateLikedMutation.error
      ? updateLikedMutation.error.message
      : null,
    likedCount,
  };
};
