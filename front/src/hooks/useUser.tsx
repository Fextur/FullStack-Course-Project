import { useRecoilState } from "recoil";
import { userAtom } from "@/atoms";
import { User } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { allUsers, testUser } from "@/data/users";

export const DEFAULT_USER_IMAGE =
  "https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg";

export const useUser = () => {
  const [user, setUser] = useRecoilState(userAtom);

  const login = async (username: User["username"], password: string) => {
    //TODO: implement login logic
    return new Promise<User | null>((resolve, reject) => {
      const user = allUsers.find((user) => user.username === username);
      if (user && password === "123") {
        resolve(user);
      } else {
        reject(new Error("Invalid credentials"));
      }
    });
  };

  const loginMutation = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: User["username"];
      password: string;
    }) => login(username, password),
    onSuccess: (user) => {
      if (user) {
        setUser({ ...user, image: user.image || DEFAULT_USER_IMAGE });
      }
    },
  });

  const logout = () => {
    //TODO: implement logout logic
    setUser(null);
  };

  return {
    user,
    login: loginMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error ? loginMutation.error.message : null,
  };
};
