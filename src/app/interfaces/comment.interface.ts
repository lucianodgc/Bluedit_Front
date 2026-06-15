export interface Comment {
  id: number;
  postId?: number;
  userId?: number;
  username: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
}