// backend/config/redis.js
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  tls: {}, // ensures secure TLS connection
  maxRetriesPerRequest: null, // important for Upstash
});

redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

export default redis;
