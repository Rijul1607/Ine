// src/services/auctionService.js
import redis from '../config/redis.js';

const key = (id) => `auction:${id}:highest`;

export async function getHighestBid(auctionId) {
  const v = await redis.get(key(auctionId));
  return v ? parseFloat(v) : null;
}

export async function setHighestBid(auctionId, amount) {
  await redis.set(key(auctionId), amount.toString());
}
