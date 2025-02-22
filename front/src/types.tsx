export type User = {
  id: string;
  email: string;
  username: string;
  image?: string;
};

export type Comment = {
  id: number;
  content: string;
  user: User;
};

export type Post = {
  id: number;
  image: string;
  content: string;
  likes: number;
  comments?: Comment[];
  user: User;
  isUserLiked?: boolean;
  commentsCount?: number;
};
