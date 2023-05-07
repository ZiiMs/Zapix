import Redis from "ioredis";

export const createRedisClient = () => {
  try {
    const redis = new Redis(process.env.REDIS_URL);

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
