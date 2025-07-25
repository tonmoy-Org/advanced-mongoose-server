const redis = require('redis');
const { promisify } = require('util');

// Create Redis client without password
const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

// Promisify Redis methods
const getAsync = promisify(client.get).bind(client);
const setexAsync = promisify(client.setex).bind(client);

// Connection event handlers
client.on('connect', () => {
    console.log('✅ Connected to Redis server');
});

client.on('error', (err) => {
    console.error('❌ Redis error:', err);
});

module.exports = {
    client,
    getAsync,
    setexAsync,

};