import { useMutation } from "@tanstack/react-query";
import { User } from "@/types";
import { DEFAULT_USER_IMAGE } from "@/hooks/useUser";
import { useSetRecoilState } from "recoil";
import { userAtom } from "@/atoms";
import { allUsers } from "@/data/users";

export const useRegister = () => {
  const setUser = useSetRecoilState(userAtom);

  const registerUser = async (
    email: User["email"],
    username: User["username"],
    password: string,
    image?: User["image"]
  ): Promise<User | null> => {
    //TODO: implement register logic
    console.log(password);
    return new Promise<User | null>((resolve, reject) => {
      if (allUsers.some((user) => user.username === username)) {
        reject(new Error("Username is already taken"));
      } else if (allUsers.some((user) => user.email === email)) {
        reject(new Error("Email is already in use"));
      } else {
        resolve({
          id: allUsers.length.toString(),
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
      email: User["email"];
      username: User["username"];
      password: string;
      image?: User["image"];
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
