import { aviciiUser, chrisUser, idoUser, testUser } from "@/data/users";
import { Post } from "@/types";

export const posts: Post[] = [
  {
    id: 1,
    image:
      "https://www.football.org.il/ImageServer/GetImage.ashx?type=2&id=246801&width=240&height=305",
    content: "hi nkjdsfnc lnfscljs",
    likes: 2,
    user: idoUser,
    isUserLiked: true,
    commentsCount: 0,
  },
  {
    id: 2,
    image:
      "https://img.haarets.co.il/bs/0000017f-dedd-d856-a37f-ffdd3f050000/d8/14/b2398b308812bb73ded7c9d004ee/3382994971.jpg",
    content: "hi nkjdsfnc lnfscljs",
    likes: 2,
    user: chrisUser,
    commentsCount: 5,
  },
  {
    id: 3,
    image: "https://www.pc.co.il/wp-content/uploads/2011/10/idoa.jpg",
    content: "hi nkjdsfnc lnfscljs",
    likes: 2,
    user: aviciiUser,
    commentsCount: 3,
  },
  {
    id: 4,
    image:
      "https://www.football.org.il/ImageServer/GetImage.ashx?type=2&id=407834&width=240&height=305",
    content: "hi nkjdsfnc lnfscljs",
    likes: 2,
    user: testUser,
    commentsCount: 4,
  },
  {
    id: 5,
    image:
      "https://www.football.org.il/ImageServer/GetImage.ashx?type=2&id=407834&width=240&height=305",
    content: "hi nkjdsfnc lnfscljs",
    likes: 2,
    user: testUser,
    commentsCount: 4,
  },
  {
    id: 6,
    image:
      "https://www.football.org.il/ImageServer/GetImage.ashx?type=2&id=407834&width=240&height=305",
    content: "hi nkjdsfnc lnfscljs",
    likes: 2,
    user: testUser,
    commentsCount: 4,
  },
  {
    id: 7,
    image:
      "https://www.football.org.il/ImageServer/GetImage.ashx?type=2&id=407834&width=240&height=305",
    content: "hi nkjdsfnc lnfscljs",
    likes: 2,
    user: testUser,
    commentsCount: 4,
  },
  {
    id: 8,
    image:
      "https://www.football.org.il/ImageServer/GetImage.ashx?type=2&id=407834&width=240&height=305",
    content: "hi nkjdsfnc lnfscljs",
    likes: 2,
    user: testUser,
    commentsCount: 4,
  },
  {
    id: 9,
    image:
      "https://www.football.org.il/ImageServer/GetImage.ashx?type=2&id=407834&width=240&height=305",
    content: "hi nkjdsfnc lnfscljs",
    likes: 2,
    user: testUser,
    commentsCount: 4,
  },
];
