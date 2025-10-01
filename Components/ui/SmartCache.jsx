import { useState, useEffect, useCallback } from 'react';

class SmartCache {
  constructor(maxSize = 50, ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.accessTimes = new Map();
  }

  set(key, value) {
    const now = Date.now();
    
    // Remove expired entries
    this.cleanup();
    
    // If cache is full, remove least recently accessed item
    if (this.cache.size >= this.maxSize) {
      const lruKey = this.getLeastRecentlyUsed();
      this.cache.delete(lruKey);
      this.accessTimes.delete(lruKey);
    }

    this.cache.set(key, {
      value,
      timestamp: now,
      accessCount: 1
    });
    this.accessTimes.set(key, now);
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    
    // Check if item has expired
    if (now - item.timestamp > this.ttl) {
      this.cache.delete(key);
      this.accessTimes.delete(key);
      return null;
    }

    // Update access time and count
    item.accessCount++;
    this.accessTimes.set(key, now);
    
    return item.value;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key);
        this.accessTimes.delete(key);
      }
    }
  }

  getLeastRecentlyUsed() {
    let lruKey = null;
    let lruTime = Infinity;
    
    for (const [key, time] of this.accessTimes.entries()) {
      if (time < lruTime) {
        lruTime = time;
        lruKey = key;
      }
    }
    
    return lruKey;
  }

  clear() {
    this.cache.clear();
    this.accessTimes.clear();
  }

  has(key) {
    return this.cache.has(key) && Date.now() - this.cache.get(key).timestamp <= this.ttl;
  }
}

// Global cache instance
const globalCache = new SmartCache();

export const useSmartCache = (key, fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize fetchFunction to prevent unnecessary re-renders
  const memoizedFetch = useCallback(fetchFunction, dependencies);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Try to get from cache first
        const cachedData = globalCache.get(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        // Fetch new data
        const newData = await memoizedFetch();
        
        // Store in cache
        globalCache.set(key, newData);
        
        setData(newData);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, memoizedFetch]);

  const invalidate = useCallback(() => {
    globalCache.cache.delete(key);
    globalCache.accessTimes.delete(key);
  }, [key]);

  return { data, loading, error, invalidate };
};

export default globalCache;