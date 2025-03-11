import { Service } from "typedi";
import { prisma } from "../config/prisma";
import { MapAnnotationData } from "../models/MapAnnotationDataModel";
import { convertNewsToMapAnnotationData } from "../util/convertToMapAnnotationData";

@Service()
export class NewsService {
    /**
     * ニュース記事のデータ情報の一覧を取得
     * publishedAtが一週間以内のニュース記事を取得
     * @returns ニュース記事のデータ情報の一覧
     */
    async getNews(): Promise<MapAnnotationData[]> {
        const news = await prisma.news.findMany({
            where: {
                // 7日以内の記事を取得
                publishedAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7日前以降
                },
                // categoryがなしと空は除外
                category: {
                    notIn: ["", "なし"]
                }
            },
            orderBy: {
                publishedAt: "desc"
            }
        });

        return news.map(convertNewsToMapAnnotationData);
    }
}