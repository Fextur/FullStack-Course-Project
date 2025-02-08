import { useMutation, useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { DEFAULT_USER_IMAGE } from "@/hooks/useUser";
import { useRecoilState } from "recoil";
import { userAtom } from "@/atoms";

export const useProfile = (id: string) => {
  const [user, setUser] = useRecoilState(userAtom);

  const fetchUserProfile = async (id: string): Promise<User | null> => {
    if (id === user?.id) return user;
    // TODO: Fetch user profile from the server
    const users = [
      {
        id: "2",
        username: "ido",
        email: "idodo@id.o",
        image: DEFAULT_USER_IMAGE,
      },
      {
        id: "3",
        username: "chris",
        email: "chris@mdr.gov",
        image: DEFAULT_USER_IMAGE,
      },
      {
        id: "4",
        username: "avicii",
        email: "avicii@fex.gang",
        image: DEFAULT_USER_IMAGE,
      },
    ];
    return users.find((user) => user.id === id) || null;
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
    id: string,
    username: string | null,
    image: string | null
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
      id: string;
      username: string | null;
      image: string | null;
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
