import { NewsResponse } from "../models/NewsModel";
import { prisma } from "../config/prisma";

/**
 * ニュースデータをデータベースに保存
 * - 同じURLのデータがある場合は **更新**
 * - なければ **新規登録**
 * @param newsData `NewsResponse` 型のデータ
 */
export async function saveToDatabase(newsData: NewsResponse): Promise<void> {
    try {
        await prisma.news.upsert({
            where: { url: newsData.url }, // URLが一致するデータを探す
            update: { // 存在する場合はデータを更新
                title: newsData.title,
                description: newsData.description,
                content: newsData.content,
                image: newsData.image,
                publishedAt: newsData.publishedAt,
                createdAt: newsData.createdAt,
                sourceName: newsData.source.name,
                sourceUrl: newsData.source.url,
                latitude: newsData.latitude,
                longitude: newsData.longitude,
                formattedAddress: newsData.formattedAddress,
                category: newsData.category,
                summary: newsData.summary
            },
            create: { // 存在しない場合は新規作成
                title: newsData.title,
                description: newsData.description,
                content: newsData.content,
                url: newsData.url,
                image: newsData.image,
                publishedAt: newsData.publishedAt,
                createdAt: newsData.createdAt,
                sourceName: newsData.source.name,
                sourceUrl: newsData.source.url,
                latitude: newsData.latitude,
                longitude: newsData.longitude,
                formattedAddress: newsData.formattedAddress,
                category: newsData.category,
                summary: newsData.summary
            }
        });

        console.log("📌 DB登録/更新成功:", newsData.title);
    } catch (error) {
        console.error("❌ DB登録エラー:", error);
        throw new Error("データベースへの保存に失敗しました");
    }
}