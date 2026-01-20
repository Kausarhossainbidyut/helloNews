import axios from 'axios';
import { API_CONFIG } from '../constants/countries';
import cacheService from './cacheService';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add API key as query parameter since NewsAPI expects it that way
apiClient.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    apiKey: API_CONFIG.API_KEY
  };
  return config;
});

export const newsService = {
  // Get everything (using the provided API format for all data)
  getAllNews: async (query = '', sortBy = 'publishedAt', sources = '') => {
    try {
      // Check cache first
      const cacheKey = query || sources || 'latest';
      const cachedData = cacheService.get('all', 'everything', cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // Calculate date (one month ago from today)
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 1);
      const fromDateStr = fromDate.toISOString().split('T')[0];

      const params = {
        q: query || 'latest',
        from: fromDateStr,
        sortBy: sortBy,
        pageSize: 20
      };

      // Add sources parameter if provided
      if (sources) {
        params.sources = sources;
      }

      const response = await apiClient.get('/everything', { params });
      
      // Cache the response
      cacheService.set('all', 'everything', cacheKey, response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Get everything (search endpoint) - alternative if top-headlines has limitations
  getEverything: async (query, sortBy = 'publishedAt') => {
    try {
      // Check cache first
      const cachedData = cacheService.get('search', 'all', query);
      if (cachedData) {
        return cachedData;
      }

      const response = await apiClient.get('/everything', {
        params: {
          q: query,
          sortBy: sortBy,
          pageSize: 20
        }
      });
      
      // Cache the response
      cacheService.set('search', 'all', query, response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }
};

export default newsService;