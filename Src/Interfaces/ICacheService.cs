using System;

namespace Our.Community.Configuration.Interfaces;

interface ICacheService
{
    T GetOrSet<T>(string cacheKey, Func<T> getItemCallback) where T : class;
}