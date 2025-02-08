import { useMutation } from "@tanstack/react-query";
import { User } from "@/types";
import { DEFAULT_USER_IMAGE } from "@/hooks/useUser";
import { useSetRecoilState } from "recoil";
import { userAtom } from "@/atoms";

export const useRegister = () => {
  const setUser = useSetRecoilState(userAtom);

  const registerUser = async (
    email: string,
    username: string,
    password: string,
    image?: string
  ): Promise<User | null> => {
    //TODO: implement register logic
    console.log(password);
    return new Promise<User | null>((resolve, reject) => {
      if (username === "test") {
        reject(new Error("Username is already taken"));
      } else if (email === "test@test.com") {
        reject(new Error("Email is already in use"));
      } else {
        resolve({
          id: "1",
          email,
          username,
          image: image ?? DEFAULT_USER_IMAGE,
        });
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
      image?: string;
    }) => registerUser(email, username, password, image),
    onSuccess: (user) => {
      if (user) {
        setUser({ ...user });
      }
    },
  });

  return {
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error
      ? registerMutation.error.message
      : null,
  };
};
