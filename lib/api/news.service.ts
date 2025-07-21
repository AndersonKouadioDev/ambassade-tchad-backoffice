import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api as apiClient } from '@/lib/api-http';

// Types pour les actualités selon l'API backend
export interface News {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsData {
  title: string;
  content: string;
  published: boolean;
}

export interface UpdateNewsData {
  title?: string;
  content?: string;
  published?: boolean;
}

export interface NewsFilters {
  title?: string;
  published?: boolean;
  authorId?: string;
}

export interface NewsStats {
  total: number;
  published: number;
  unpublished: number;
  thisMonth: number;
}

export interface PaginatedNewsResponse {
  data: News[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Services API selon les endpoints du guide
class NewsService {
  // Obtenir toutes les actualités (publique)
  async getNews(): Promise<News[]> {
    const response = await apiClient.get('/news');
    return response.data;
  }

  // Filtrer les actualités
  async filterNews(filters: NewsFilters = {}): Promise<News[]> {
    const params = new URLSearchParams();
    if (filters.title) params.append('title', filters.title);
    if (filters.published !== undefined) params.append('published', filters.published.toString());
    if (filters.authorId) params.append('authorId', filters.authorId);

    const response = await apiClient.get(`/news/filter?${params.toString()}`);
    return response.data;
  }

  // Statistiques des actualités
  async getNewsStats(): Promise<NewsStats> {
    const response = await apiClient.get('/news/stats');
    return response.data;
  }

  // Obtenir une actualité par ID
  async getNewsById(id: string): Promise<News> {
    const response = await apiClient.get(`/news/${id}`);
    return response.data;
  }

  // Créer une actualité
  async createNews(newsData: CreateNewsData): Promise<News> {
    const response = await apiClient.post('/news', newsData);
    return response.data;
  }

  // Mettre à jour une actualité
  async updateNews(id: string, newsData: UpdateNewsData): Promise<News> {
    const response = await apiClient.put(`/news/${id}`, newsData);
    return response.data;
  }

  // Supprimer une actualité
  async deleteNews(id: string): Promise<void> {
    await apiClient.delete(`/news/${id}`);
  }
}

export const newsService = new NewsService();

// Hooks TanStack Query
export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => newsService.getNews(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFilteredNews = (filters: NewsFilters) => {
  return useQuery({
    queryKey: ['news', 'filtered', filters],
    queryFn: () => newsService.filterNews(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useNewsStats = () => {
  return useQuery({
    queryKey: ['news', 'stats'],
    queryFn: () => newsService.getNewsStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useNewsItem = (id: string) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => newsService.getNewsById(id),
    enabled: !!id,
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: newsService.createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, newsData }: { id: string; newsData: UpdateNewsData }) => 
      newsService.updateNews(id, newsData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: newsService.deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};