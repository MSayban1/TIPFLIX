
export interface Movie {
  id: string;
  title: string;
  description: string;
  year: string;
  category: string;
  genres: string[];
  thumbnailUrl: string;
  links: {
    server1: string;
    server2: string;
    server3: string;
  };
  downloads?: {
    p480?: string;
    p720?: string;
    p1080?: string;
  };
  featured: boolean;
  visible: boolean;
  quality: string;
  createdAt: number;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  movieId?: string;
}

export interface MetadataItem {
  id: string;
  name: string;
}

export enum View {
  Home = 'home',
  Categories = 'categories',
  Search = 'search',
  Details = 'details'
}

export const QUALITIES = ['HD', '720p', '1080p', 'CAM'];
