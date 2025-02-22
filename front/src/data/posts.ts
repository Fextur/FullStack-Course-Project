import { aviciiUser, chrisUser, idoUser, testUser } from "@/data/users";
import { Post } from "@/types";

export const posts: Post[] = [
  ...Array.from({ length: 70 }, (_, i) => ({
    id: (i + 10).toString(),
    image: [
      "https://www.football.org.il/ImageServer/GetImage.ashx?type=2&id=246801&width=240&height=305",
      "https://img.haarets.co.il/bs/0000017f-dedd-d856-a37f-ffdd3f050000/d8/14/b2398b308812bb73ded7c9d004ee/3382994971.jpg",
      "https://www.pc.co.il/wp-content/uploads/2011/10/idoa.jpg",
      "https://www.football.org.il/ImageServer/GetImage.ashx?type=2&id=407834&width=240&height=305",
    ][Math.floor(Math.random() * 4)],
    content: i.toString(),
    likes: Math.floor(Math.random() * 20),
    user: [idoUser, chrisUser, aviciiUser, testUser][
      Math.floor(Math.random() * 4)
    ],
    commentsCount: Math.floor(Math.random() * 23),
    isUserLiked: Math.random() < 0.5,
  })),
];
