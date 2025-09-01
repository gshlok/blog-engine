export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  author: {
    nickname: string;
  };
}