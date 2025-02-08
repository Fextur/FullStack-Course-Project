import { useUser } from "@/hooks/useUser";

const Profile = () => {
  const { user } = useUser();
  return <h1>{user?.username} Page</h1>;
};

export default Profile;
