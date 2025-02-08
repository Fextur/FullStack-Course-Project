import { User } from "@/types";

export const testUser: User = {
  username: "test",
  id: "1",
  email: "test@test.com",
};
export const idoUser: User = {
  id: "2",
  username: "ido",
  email: "idodo@id.o",
};
export const chrisUser: User = {
  id: "3",
  username: "chris",
  email: "chris@mdr.gov",
};
export const aviciiUser: User = {
  id: "4",
  username: "avicii",
  email: "avicii@fex.gang",
};

export const allUsers: User[] = [testUser, idoUser, chrisUser, aviciiUser];
