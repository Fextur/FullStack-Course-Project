export type User = {
  id: string;
  username: string;
  image?: string;
};

export type Comment = {
  id: number;
  content: string;
};

export type Post = {
  id: number;
  image: string;
  content: string;
  likes: number;
  comments: Comment[];
  user: User;
};
