import { atom } from "recoil";
import { User } from "@/types";

export const userAtom = atom<User | null>({
  key: "userAtom",
  default: null, // No user is logged in by default
});
