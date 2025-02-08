import { useMutation, useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { useRecoilState } from "recoil";
import { userAtom } from "@/atoms";
import { allUsers } from "@/data/users";

export const useProfile = (id: User["id"]) => {
  const [user, setUser] = useRecoilState(userAtom);

  const fetchUserProfile = async (id: User["id"]): Promise<User | null> => {
    if (id === user?.id) return user;
    // TODO: Fetch user profile from the server
    // INPUT: id
    // OUTPUT: user
    // ERRORS: "User not found", "Unknow error"
    return allUsers.find((user) => user.id === id) || null;
  };

  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => fetchUserProfile(id),
  });

  const updateUserProfile = async (
    id: User["id"],
    username: User["username"] | null,
    image: User["image"] | null
  ): Promise<User | null> => {
    return new Promise<User | null>((resolve, reject) => {
      if (!user || user.id !== id) {
        reject(new Error("You can only update your own profile."));
      } else {
        const updatedUser: User = {
          ...user,
          username: username || user.username,
          image: image || user.image,
        };
        // TODO: Update user profile on the server
        // INPUT: id, username, image (needs to handle image upload)
        // OUTPUT: updated user
        // ERRORS: "Username is already taken", "Others"

        if (username === "test") {
          reject(new Error("Username is already taken"));
        } else {
          resolve(updatedUser);
        }
      }
    });
  };

  const updateProfileMutation = useMutation({
    mutationFn: ({
      id,
      username,
      image,
    }: {
      id: User["id"];
      username: User["username"] | null;
      image: User["image"] | null;
    }) => updateUserProfile(id, username, image),
    onSuccess: (user) => {
      if (user) {
        setUser(user);
      }
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error
      ? updateProfileMutation.error.message
      : null,
    refetchProfile: refetch,
  };
};
