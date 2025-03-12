/**
 * Tweetのレスポンスモデル
 */
export interface TweetResponse {
    id: string;
    text: string;
    createdAt: string;
    authorId?: string | null;
    authorName?: string | null;
    authorProfile?: string | null;
    mediaUrl?: string | null;
    tweetUrl?: string | null;
    isRateLimited?: boolean; // API制限時に true
    retryAfter?: number;// 429発生時のリトライ推奨秒数
}

/**
 * Tweet取得クエリ
 */
export interface GetTweetsQuery {
    groups?: string; // 🔹 "火災,西区|火災,博多区" の形式
}