import { Service } from "typedi";
import { readOnlyTwitterClient } from "../config/twitter"; 
import { TweetResponse, GetTweetsQuery } from "../models/TweetModel";

@Service()
export class TwitterService {
    /**
     * キーワードを指定してツイートを取得
     * @param {GetTweetsQuery} query 検索するキーワードのAND・ORグループ
     * @returns {Promise<TweetResponse[]>} 取得したツイートのリスト
     */
    async fetchTweets(query: GetTweetsQuery): Promise<TweetResponse[]> {
        if (!query.groups) {
            throw new Error("検索キーワード (groups) が必要です。");
        }
    
        // クエリを適切なフォーマットに変換
        const searchQuery = this.convertGroupsToSearchQuery(query.groups);
        console.log("🔎 変換後の検索クエリ:", searchQuery);
    
        // Twitter API の検索パラメータ
        const searchParams: any = {
            query: searchQuery,
            "tweet.fields": "created_at,public_metrics",
            "media.fields": "url,preview_image_url",
            "expansions": "attachments.media_keys,author_id",
            "user.fields": "username,profile_image_url",
            "max_results": 10,
        };
    
        try {
            // Twitter API でツイート取得
            const response = await readOnlyTwitterClient.v2.search(searchQuery, searchParams);
            if (!response.data || !response.data.data) {
                console.warn("⚠️ 新しいツイートが見つかりませんでした。");
                return [];
            }
            // 取得したツイートをレスポンス用に変換
            return response.data.data.map(tweet => {
                const user = response.includes?.users?.find(u => u.id === tweet.author_id);
                const media = response.includes?.media?.find(m => m.media_key === tweet.attachments?.media_keys?.[0]);
        
                return {
                    id: tweet.id,
                    text: tweet.text,
                    createdAt: tweet.created_at || new Date().toISOString(),
                    authorId: tweet.author_id || null,
                    authorName: user?.username || "Unknown",
                    authorProfile: user?.profile_image_url || null,
                    mediaUrl: media?.url || null,
                    tweetUrl: user?.username ? `https://x.com/${user.username}/status/${tweet.id}` : null, //  追加
                    isRateLimited: false,
                };
            });
        } catch (error: any) {
            if (error.code === 429) {
                console.error("❌ Twitter API 制限エラー:", error);
                const retryAfter = error.response?.headers["retry-after"]
                ? parseInt(error.response.headers["retry-after"], 10)
                : 60;

                // 空の `TweetResponse` を作成して、リトライが必要であることを伝える
                return [
                    {
                        id: "",
                        text: "Rate limit exceeded. Please retry later.",
                        createdAt: new Date().toISOString(),
                        isRateLimited: true,
                        retryAfter: retryAfter,
                    }
                ];
            }
            throw new Error("Twitter API でエラーが発生しました。");
        }
    }

    /**
     *  `groups` を Twitter API の検索クエリに変換する関数
     * @param {string} groups - クエリパラメータの groups（例: "火災,西区|火災,博多区"）
     * @returns {string} 変換後の検索クエリ（例: `("火災 西区") OR ("火災 博多区")`）
     */
    private convertGroupsToSearchQuery(groups: string): string {
        return groups
            .split("|") 
            .map(group => 
                `(${group.split(",")
                    .map(word => `"${word.trim()}"`) // 🔹 トリム & 日本語キーワードをダブルクォートで囲む
                    .join(" ")})`
            )
            .join(" OR ")
            .replace(/[()]/g, ""); // 🔹 不要な括弧を削除
    }
}