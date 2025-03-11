/**
 * Tweetを表す型
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
}

/**
 * Tweet取得クエリ
 */
export interface GetTweetsQuery {
    groups?: string; // 🔹 "火災,西区|火災,博多区" の形式
}