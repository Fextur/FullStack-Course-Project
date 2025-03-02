import { useMutation, useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { useRecoilState } from "recoil";
import { userAtom } from "@/atoms";
import api from "@/axios/axios";
import { API_ROUTES } from "@/axios/apiRoutes";

export const useProfile = (id: User["id"]) => {
  const [user, setUser] = useRecoilState(userAtom);

  const fetchUserProfile = async (id: User["id"]): Promise<User | null> => {
    try {
      if (id === user?.id) return user;
      const fetchedUser = await api.get<User>(`${API_ROUTES.users}/${id}`);

      return fetchedUser.data;
    } catch (error) {
      console.error("Error fetching user ", error);
      throw error;
    }
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
    try {
      if (!user || user.id !== id) {
        throw new Error("You can only update your own profile.");
      }

      const updatedUser = await api.put<User>(`${API_ROUTES.users}/${id}`, {
        username: username || user.username,
        image: image || user.image,
      });

      return updatedUser.data;
    } catch (error) {
      console.error("Error fetching user ", error);
      throw error;
    }
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
