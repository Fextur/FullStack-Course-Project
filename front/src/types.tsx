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

export type ChatMessage = {
  message: string;
  receiverId: string;
  senderId: string;
  dateTime: Date;
};

export type ChatUser = {
  id: string;
  userId: string;
  username: string;
  email: string;
  image?: string;
  lastMessage?: string;
  unreadCount: number;
  dateTime: ChatMessage["dateTime"];
};

export enum ContentType {
  JOKE = "Tell a funny short joke.",
  QUOTE = "Give me a short emotional and inspiring quote.",
  FUN_FACT = "Tell me a short interesting and fun fact.",
}
