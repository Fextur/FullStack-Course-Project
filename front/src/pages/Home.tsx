import Loader from "@/components/Loader";
import PostsList from "@/components/PostsList";
import { usePosts } from "@/hooks/usePosts";

const Home = () => {
  const { posts, isLoading } = usePosts();
  return (
    <div style={{ height: "85vh", width: "100vw" }}>
      <Loader isLoading={isLoading} />
      {posts && <PostsList posts={posts} />}
    </div>
  );
};

export default Home;
