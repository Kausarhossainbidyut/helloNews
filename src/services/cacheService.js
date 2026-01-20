class CacheService {
  constructor() {
    this.cache = new Map();
    this.maxAge = 5 * 60 * 1000; // 5 minutes cache
  }

  // Generate cache key based on parameters
  generateKey(country, category, search) {
    return `${country}-${category}-${search}`;
  }

  // Store data in cache
  set(country, category, search, data) {
    const key = this.generateKey(country, category, search);
    const cacheEntry = {
      data,
      timestamp: Date.now()
    };
    this.cache.set(key, cacheEntry);
    
    // Clean old entries periodically
    this.cleanup();
  }

  // Get data from cache
  get(country, category, search) {
    const key = this.generateKey(country, category, search);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if cache is expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }

  // Clear all cache
  clear() {
    this.cache.clear();
  }

  // Get cache size
  getSize() {
    return this.cache.size;
  }
}

// Export singleton instance
export default new CacheService();