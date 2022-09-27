export interface ImageInterface {
  png: string;
  webp: string;
}

interface User {
  image: ImageInterface;
  username: string;
}

export interface RepliesInterface {
  id: number;
  content: string;
  createdAt?: string;
  score: number;
  replyingTo?: string;
  user: User;
}

export interface CommentsInterface {
  id: number;
  content: string;
  createdAt?: string;
  score: number;
  user: User;
  replies?: RepliesInterface[];
}
