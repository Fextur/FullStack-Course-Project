export type User = {
  id: string;
  email: string;
  username: string;
  image?: string;
};

export type UserWithToken = {
  accessToken: string;
  user: User;
};

export type Comment = {
  id: string;
  content: string;
  user: User;
};

export type Post = {
  id: string;
  image: string;
  content: string;
  likes: number;
  user: User;
  isUserLiked?: boolean;
  commentsCount: number;
};

export type ReturnedMessage = {
  message: string;
};

export enum ContentType {
  JOKE = "Tell a funny short joke.",
  QUOTE = "Give me a short emotional and inspiring quote.",
  FUN_FACT = "Tell me a short interesting and fun fact.",
}
