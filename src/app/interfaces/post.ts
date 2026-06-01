export interface Post {
  id: number;
  userId: number;
  username: string;
  avatarUrl?: string;
  title: string;
  content: string;
  type: 'text' | 'multimedia';
  votesCount: number;
  commentsCount: number;
  createdAt: string;
}