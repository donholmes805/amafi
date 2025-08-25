import { AMA } from '../types';

/**
 * Processes raw AMA data from the API to ensure data consistency.
 * - Converts `start_time` or `startTime` strings into Date objects.
 * - Ensures camelCase properties are prioritized over snake_case for compatibility.
 * @param ama The raw AMA object from the API.
 * @returns A processed AMA object with correct types.
 */
export const processAMA = (ama: any): AMA => ({
  ...ama,
  startTime: new Date(ama.startTime || ama.start_time),
  youtubeUrls: ama.youtubeUrls || (ama.youtube_url ? ama.youtube_url.split(',').filter(Boolean) : []),
  isFeatured: ama.isFeatured ?? ama.is_featured,
  timeLimitMinutes: ama.timeLimitMinutes || ama.time_limit_minutes,
  walletAddress: ama.walletAddress || ama.wallet_address,
  walletTicker: ama.walletTicker || ama.wallet_ticker,
  amaType: ama.amaType || ama.ama_type,
});
