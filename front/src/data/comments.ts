import { aviciiUser, chrisUser, idoUser, testUser } from "@/data/users";
import { Comment } from "@/types";

export const comments: Comment[] = [
  ...Array.from({ length: 100 }, (_, i) => ({
    id: (i + 100).toString(),
    content: `Comment ${i + 1}`,
    user: [idoUser, chrisUser, aviciiUser, testUser][
      Math.floor(Math.random() * 4)
    ],
  })),
];

export const generateComments = (count: number) => [
  ...Array.from({ length: count }, (_, i) => ({
    id: (i + 100).toString(),
    content: `Comment ${i + 1}`,
    user: [idoUser, chrisUser, aviciiUser, testUser][
      Math.floor(Math.random() * 4)
    ],
  })),
];
