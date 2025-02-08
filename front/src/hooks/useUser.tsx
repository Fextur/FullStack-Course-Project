import { useRecoilState } from "recoil";
import { userAtom } from "@/atoms";
import { User } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const DEFAULT_USER_IMAGE =
  "https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg";

export const useUser = () => {
  const [user, setUser] = useRecoilState(userAtom);

  const login = async (username: string, password: string) => {
    //TODO: implement login logic
    return new Promise<User | null>((resolve, reject) => {
      if (username === "test" && password === "123") {
        resolve({ username: "test", id: "1", email: "test@test.com" });
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
      username: string;
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
