export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'PRIVATE';
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  authorId: string;
  author: User;
  categoryId?: string;
  category?: Category;
  tags: Tag[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  views: number;
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    comments: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  email?: string;
  website?: string;
  approved: boolean;
  postId: string;
  parentId?: string;
  parent?: Comment;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  author?: string;
  status?: string;
  featured?: boolean;
  sort?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchResult {
  posts: Post[];
  pagination: PaginationInfo;
  filters: SearchFilters;
  suggestions: string[];
}

export interface SearchSuggestion {
  type: 'post' | 'tag' | 'category';
  text: string;
  slug: string;
}

export interface PopularSearch {
  popularTags: Array<{
    name: string;
    slug: string;
    count: number;
  }>;
  popularCategories: Array<{
    name: string;
    slug: string;
    count: number;
  }>;
}