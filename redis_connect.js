const config = require("./config.json");

module.exports = redisConnect = () => {
    const redis = require('redis');
    const client = redis.createClient({
        host: config.redis_host,
        port: config.redis_port
    });

    client.on('error', err => {
        console.log('Something went wrong:\n' + err);
    });

    return client;
}