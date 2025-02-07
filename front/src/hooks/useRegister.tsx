import { useMutation } from "@tanstack/react-query";
import { User } from "@/types";
import { DEFAULT_USER_IMAGE } from "@/hooks/useUser";

export const useRegister = () => {
  const registerUser = async (
    email: string,
    username: string,
    password: string,
    image?: File
  ): Promise<User | null> => {
    return new Promise<User | null>((resolve, reject) => {
      if (username !== "test") {
        resolve({
          id: "1",
          email,
          username,
          image: image ? URL.createObjectURL(image) : DEFAULT_USER_IMAGE,
        });
      } else {
        reject(new Error("Username already exists"));
      }
    });
  };
  const registerMutation = useMutation({
    mutationFn: ({
      email,
      username,
      password,
      image,
    }: {
      email: string;
      username: string;
      password: string;
      image?: File;
    }) => registerUser(email, username, password, image),
  });

  return {
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error
      ? registerMutation.error.message
      : null,
  };
};
