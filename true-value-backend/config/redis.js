const redis = require('redis');

// In production, REDIS_URL should be in .env
const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 3) {
                console.warn('Redis reconnection stopped. Cache will be disabled.');
                return false; // Stop retrying
            }
            return Math.min(retries * 50, 2000);
        },
        connectTimeout: 3000 // 3s timeout
    }
});

let isRedisReady = false;

client.on('error', (err) => {
    // Suppress errors to prevent crash
    // console.warn('Redis Client Error:', err.message);
    isRedisReady = false;
});

client.on('ready', () => {
    console.log('Redis connected successfully 🚀');
    isRedisReady = true;
});

(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.warn('Redis Connection Failed: Running without cache.');
    }
})();

// Wrapper to prevent crashes when Redis is down
const safeClient = {
    get: async (key) => {
        if (!isRedisReady) return null;
        try { return await client.get(key); } catch (e) { return null; }
    },
    setEx: async (key, seconds, value) => {
        if (!isRedisReady) return;
        try { await client.setEx(key, seconds, value); } catch (e) { }
    },
    del: async (key) => {
        if (!isRedisReady) return;
        try { await client.del(key); } catch (e) { }
    },
    // Expose original client just in case
    _client: client
};

module.exports = safeClient;
