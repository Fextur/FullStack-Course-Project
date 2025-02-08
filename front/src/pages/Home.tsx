import { Post } from "../types";
import PostsList from "@/components/PostsList";

const posts: Post[] = [
  {
    id: 1,
    image: "./tomato.webp",
    content: "hi nkjdsfnc lnfscljs",
    likes: 2,
    comments: [{ id: 1, content: "aaa" }],
    user: { id: "1", username: "haim" },
  },
  {
    id: 2,
    image: "./tomato.webp",
    content: "hi nkjdsfnc lnfscljs",
    likes: 2,
    comments: [{ id: 1, content: "aaa" }],
    user: { id: "1", username: "haim" },
  },
  {
    id: 3,
    image: "./tomato.webp",
    content: "hi nkjdsfnc lnfscljs",
    likes: 2,
    comments: [{ id: 1, content: "aaa" }],
    user: { id: "1", username: "haim" },
  },
  {
    id: 4,
    image: "./tomato.webp",
    content: "hi nkjdsfnc lnfscljs",
    likes: 2,
    comments: [{ id: 1, content: "aaa" }],
    user: { id: "1", username: "haim" },
  },
];

const Home = () => {
  return (
    <div style={{height:'85vh', width:'100vw'}}>
      <PostsList posts={posts}/>
    </div>
  );
};

export default Home;
