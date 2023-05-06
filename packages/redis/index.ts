import Redis, { type RedisOptions } from "ioredis";

const options: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT ?? "6379"),
  lazyConnect: true,
  password: process.env.REDIS_PASSWORD,
};

export const createRedisClient = () => {
  try {
    const redis = new Redis(options);

    redis.on("connect", (data: unknown) => {
      console.log("[REDIS] Connected.", data);
    });

    redis.on("error", (error: unknown) => {
      console.warn("[REDIS] Error connecting!", error);
    });

    return redis;
  } catch (e) {
    throw new Error(`[REDIS] Could not create Redis instance!`);
  }
};

export const redisClient = createRedisClient();
