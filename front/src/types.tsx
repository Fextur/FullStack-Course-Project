export type User = {
  id: string;
  email: string;
  username: string;
  image?: string;
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

export type ChatMessage = User & {
  message: string;
  dateTime: Date;
};

export type ChatUser = User & {
  lastMessage: ChatMessage["message"];
  unreadCount: number;
  dateTime: ChatMessage["dateTime"];
};
