const redis = require("redis");

const REDIS_PORT = "http://127.0.0.1:6379";
// const REDIS_PORT = {
// 	host: process.env.REDIS_HOST,
// 	port: process.env.REDIS_PORT,
// 	password: process.env.REDIS_PASSWORD,
// };
const redisClient = redis.createClient(REDIS_PORT);
if (redisClient) {
	console.log(`Redis running on port ${process.env.REDIS_PORT}`.yellow);
}
module.exports = redisClient;
