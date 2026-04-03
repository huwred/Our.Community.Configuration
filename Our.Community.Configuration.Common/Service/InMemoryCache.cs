using System;
using System.Runtime.Caching;
using Our.Community.Configuration.Interfaces;

namespace Our.Community.Configuration.Service
{
    public class InMemoryCache : ICacheService
    {
        /// <summary>
        /// Number of minutes before cache expires.
        /// </summary>
        private readonly int _expireIn = 10;
        public bool DoNotExpire { get; set; }

        public InMemoryCache()
        {

        }

        /// <summary>
        /// Create new cache object
        /// </summary>
        /// <param name="expires">number of minutes to keep cache</param>
        public InMemoryCache(int expires)
        {
            _expireIn = expires;
        }

        public T GetOrSet<T>(string cacheKey, Func<T> getItemCallback) where T : class
        {
            if (MemoryCache.Default.Get(cacheKey) is T item) return item;
            item = getItemCallback();
            if (DoNotExpire)
                MemoryCache.Default.Add(cacheKey, item, null);
            else
                MemoryCache.Default.Add(cacheKey, item, DateTimeOffset.Now.AddMinutes(_expireIn));
            return item;
        }

        public T GetOrSet<T>(string cacheKey, Func<string, string, T> getItemCallback, string start, string end) where T : class
        {
            if (MemoryCache.Default.Get(cacheKey) is T item) return item;
            item = getItemCallback(start, end);
            MemoryCache.Default.Add(cacheKey, item, DateTimeOffset.Now.AddMinutes(_expireIn));
            return item;
        }
        public void Remove(string cacheKey)
        {
            var item = MemoryCache.Default.Get(cacheKey);
            if (item != null)
                MemoryCache.Default.Remove(cacheKey);
        }

    }
}