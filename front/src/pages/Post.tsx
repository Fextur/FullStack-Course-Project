import { useParams } from "@tanstack/react-router";

const Post = () => {
  const { id } = useParams({ strict: false });

  return <h1>{id ? `Editing post ${id}` : "Create new post"}</h1>;
};

export default Post;
