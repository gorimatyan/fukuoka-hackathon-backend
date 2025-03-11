import axios from 'axios';
import env from '../config/env';

// GNews API キーとURL
const API_KEY = env.GNEWS_API_KEY;
const GNEWS_URL = "https://gnews.io/api/v4/search";

/**
 * 指定したキーワードと日付範囲でニュースを取得する
 * @param keywords 検索キーワード（配列）
 * @param daysAgo 過去何日以内のニュースを取得するか
 * @returns ニュース記事リスト
 */
export async function fetchNews(keywords: string[], daysAgo: number = 7) {
    try {
        // 日付の範囲を計算（現在日時から過去 `daysAgo` 日前）
        const today = new Date();
        const fromDate = new Date();
        fromDate.setDate(today.getDate() - daysAgo);

        // フォーマットを "YYYY-MM-DD" にする
        const formatDate = (date: Date) => date.toISOString().split("T")[0];

        // キーワードを AND 検索（"福岡 AND 事件" のように）
        const query = keywords.join(" AND ");

        const response = await axios.get(GNEWS_URL, {
            params: {
                q: query,
                lang: "ja",
                country: "jp",
                max: 1,
                from: formatDate(fromDate),  // 過去 `daysAgo` 日の開始日
                to: formatDate(today),      // 今日の日付
                token: API_KEY
            }
        });

        console.log("📰 ニュース記事:", response.data.articles);
        return response.data.articles;

    } catch (error) {
        console.error("❌ GNews API エラー:", error);
        return [];
    }
}