import { MapAnnotationData } from "../models/MapAnnotationDataModel";

/**
 * 🔄 消防関連データを `MapAnnotationData` に変換する
 * @param {any} d - Prismaから取得したデータ（消防関連）
 * @returns {MapAnnotationData} フォーマット済みのデータ
 */
export function convertFireDataToMapAnnotationData(d: any): MapAnnotationData {
    return {
        id: d.id?.toString() ?? "unknown",
        category: d.disasterType ?? "不明",
        location: {
            lat: d.latitude ?? 0,
            lng: d.longitude ?? 0,
        },
        title: d.subject ?? "タイトル不明",
        summary: d.subject ?? "内容不明",
        contentBody: d.body ?? "詳細情報なし",
        sourceName: d.from ?? "不明な発信者",
        sourceUrl: null,
        clusteringIdentifier: d.disasterType ?? "未分類",
        data: {
            area: d.address ?? "住所不明",
            link: "",
        },
        markerImgUrl: "",
        publishedAt: d.receivedAt ?? new Date(),
        createdAt: d.createdAt ?? new Date(),
    };
}

/**
 * 🔄 ニュースデータを `MapAnnotationData` に変換する
 * @param {any} n - Prismaから取得したニュースデータ
 * @returns {MapAnnotationData} フォーマット済みのデータ
 */
export function convertNewsToMapAnnotationData(n: any): MapAnnotationData {
    return {
        id: n.id.toString(),
        category: n.category ?? "ニュース",
        location: {
            lat: n.latitude ? Number(n.latitude) || 0 : 0, // `latitude` の安全な数値変換
            lng: n.longitude ? Number(n.longitude) || 0 : 0,
        },
        title: n.summary ?? "タイトルなし",
        summary: n.summary ?? "内容なし",
        contentBody: n.content ?? "詳細情報なし",
        sourceName: n.sourceName || "不明な発信元",
        sourceUrl: n.sourceUrl || "",
        clusteringIdentifier: n.category,
        data: {
            area: n.formattedAddress || "不明",
            link: n.url,
        },
        markerImgUrl: n.image || "",
        publishedAt: n.publishedAt ?? new Date(),
        createdAt: n.createdAt ?? new Date(),
    };
}