import Redis from "ioredis";

export const createRedisClient = () => {
  try {
    const redis = new Redis(
      process.env.REDIS_URL ?? "redis://@127.0.0.1:6379/0",
    );

    redis.on("connect", (data: unknown) => {
      console.log("[REDIS] Connected.");
    });

    redis.on("error", (error: unknown) => {
      console.warn("[REDIS] Error connecting!", error);
    });

    return redis;
  } catch (e) {
    throw new Error(`[REDIS] Could not create Redis instance!`);
  }
};

export const Subscriber = createRedisClient();
export const Publisher = createRedisClient();
