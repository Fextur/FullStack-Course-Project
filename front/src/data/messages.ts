import { allUsers, testUser } from "@/data/users";
import { ChatMessage, User } from "@/types";

export const generateMessage = (
  myUserId: User["id"],
  otherUserId: User["id"]
): ChatMessage[] => [
  {
    message:
      "lognskjdshfkjsdhfjkdshkjfsdhkjfhsdjkfsdkjfkjfhkjhkjsdhfalkhlsdkfhasdkjfhalksdhklfalksdhfkhalksdhfklahkljsdhfklahklsdhfklahskljdfhlkashdlkjfhalksdhfklhklsdhfkljahskldjfhkalhsdkljfa",
    ...(allUsers.find((user) => user.id === myUserId) ?? testUser),
    dateTime: new Date(),
  },
  ...Array.from({ length: Math.random() * 1000 }, (_, i) => ({
    message: `Message ${i + 1}`,
    ...(Math.random() < 0.5
      ? allUsers.find((user) => user.id === myUserId) ?? testUser
      : allUsers.find((user) => user.id === otherUserId) ?? testUser),
    dateTime: new Date(),
  })),
];
