import cron from "node-cron";
import { fetchNews } from "../middlewares/gnews";
import { News, NewsResponse } from "../models/NewsModel";
import { extractLocation, generateSummary, classifyNews } from "../middlewares/gemini_ai";
import { geocodeAddressWithGoogle } from "../middlewares/google-geocoding";
import { saveToDatabase } from "../middlewares/saveToDatabase"; 



// 📌 毎時0分にニュースを取得・処理（1時間ごとに実行）
export async function processGoutouNews() {
    console.log("⏰ ニュース取得（1時間ごと）開始...");

    const searchKeywords = ["福岡", "強盗"];
    const searchPeriodInDays = 7;

    try {
        // ニュースを取得
        const newsList: News[] = await fetchNews(searchKeywords, searchPeriodInDays);

        for (const newsItem of newsList) {
            try {
                console.log(`🔍 ニュース処理中: ${newsItem.title}`);

                const locationDataRaw: { extractedLocation: string; } = await extractLocation(newsItem.content);

                console.log("📍 取得した住所データ:", locationDataRaw);

                let latitude: string | null = null;
                let longitude: string | null = null;
                let formattedAddress: string | null = null;

                // extractedLocation を直接使用
                const extractedAddress = locationDataRaw.extractedLocation;

                if (extractedAddress) {
                    try {
                        console.log("🌍 Google Geocoding に渡す住所:", extractedAddress);
                        const geoData = await geocodeAddressWithGoogle(extractedAddress);
                        latitude = geoData?.latitude ? geoData.latitude.toString() : null;
                        longitude = geoData?.longitude ? geoData.longitude.toString() : null;
                        formattedAddress = geoData?.formattedAddress ?? null;
                    } catch (geoError) {
                        console.warn(`⚠️ 住所の緯度経度取得に失敗: ${extractedAddress}`);
                    }
                } else {
                    console.warn(`⚠️ 住所情報が見つかりませんでした: ${newsItem.title}`);
                }

                //  ニュースの要約（キャッチコピー）を生成
                const summary = await generateSummary(newsItem.content);

                //  ニュースのジャンルを分類
                const category = await classifyNews(newsItem.content);

                //  `NewsResponse` に格納
                const newsData: NewsResponse ={
                    title: newsItem.title,
                    description: newsItem.description, 
                    content: newsItem.content,
                    url: newsItem.url,
                    image: newsItem.image,
                    publishedAt: new Date(newsItem.publishedAt),
                    createdAt: new Date(),
                    source: {
                        name: newsItem.source.name,
                        url: newsItem.source.url
                    },
                    latitude: latitude ?? '',
                    longitude: longitude ?? '',
                    formattedAddress: formattedAddress ?? '',
                    category: category,
                    summary: summary
                };

                await saveToDatabase(newsData);
                

            } catch (error) {
                console.error(`❌ ニュース処理中にエラー発生: ${newsItem.title}`, error);
            }
        }

    } catch (error) {
        console.error("❌ ニュース取得時にエラー発生:", error);
    }
};

export async function processSatujinNews() {
    console.log("⏰ ニュース取得（1時間ごと）開始...");

    const searchKeywords = ["福岡", "殺人"];
    const searchPeriodInDays = 7;

    try {
        // ニュースを取得
        const newsList: News[] = await fetchNews(searchKeywords, searchPeriodInDays);

        for (const newsItem of newsList) {
            try {
                console.log(`🔍 ニュース処理中: ${newsItem.title}`);

                const locationDataRaw: { extractedLocation: string; } = await extractLocation(newsItem.content);

                console.log("📍 取得した住所データ:", locationDataRaw);

                let latitude: string | null = null;
                let longitude: string | null = null;
                let formattedAddress: string | null = null;

                // extractedLocation を直接使用
                const extractedAddress = locationDataRaw.extractedLocation;

                if (extractedAddress) {
                    try {
                        console.log("🌍 Google Geocoding に渡す住所:", extractedAddress);
                        const geoData = await geocodeAddressWithGoogle(extractedAddress);
                        latitude = geoData?.latitude ? geoData.latitude.toString() : null;
                        longitude = geoData?.longitude ? geoData.longitude.toString() : null;
                        formattedAddress = geoData?.formattedAddress ?? null;
                    } catch (geoError) {
                        console.warn(`⚠️ 住所の緯度経度取得に失敗: ${extractedAddress}`);
                    }
                } else {
                    console.warn(`⚠️ 住所情報が見つかりませんでした: ${newsItem.title}`);
                }

                //  ニュースの要約（キャッチコピー）を生成
                const summary = await generateSummary(newsItem.content);

                //  ニュースのジャンルを分類
                const category = await classifyNews(newsItem.content);

                //  `NewsResponse` に格納
                const newsData: NewsResponse ={
                    title: newsItem.title,
                    description: newsItem.description, 
                    content: newsItem.content,
                    url: newsItem.url,
                    image: newsItem.image,
                    publishedAt: new Date(newsItem.publishedAt),
                    createdAt: new Date(),
                    source: {
                        name: newsItem.source.name,
                        url: newsItem.source.url
                    },
                    latitude: latitude ?? '',
                    longitude: longitude ?? '',
                    formattedAddress: formattedAddress ?? '',
                    category: category,
                    summary: summary
                };

                await saveToDatabase(newsData);
                

            } catch (error) {
                console.error(`❌ ニュース処理中にエラー発生: ${newsItem.title}`, error);
            }
        }

    } catch (error) {
        console.error("❌ ニュース取得時にエラー発生:", error);
    }
};

export async function processJikoNews() {
    console.log("⏰ ニュース取得（1時間ごと）開始...");

    const searchKeywords = ["福岡", "事故"];
    const searchPeriodInDays = 7;

    try {
        // ニュースを取得
        const newsList: News[] = await fetchNews(searchKeywords, searchPeriodInDays);

        for (const newsItem of newsList) {
            try {
                console.log(`🔍 ニュース処理中: ${newsItem.title}`);

                const locationDataRaw: { extractedLocation: string; } = await extractLocation(newsItem.content);

                console.log("📍 取得した住所データ:", locationDataRaw);

                let latitude: string | null = null;
                let longitude: string | null = null;
                let formattedAddress: string | null = null;

                // extractedLocation を直接使用
                const extractedAddress = locationDataRaw.extractedLocation;

                if (extractedAddress) {
                    try {
                        console.log("🌍 Google Geocoding に渡す住所:", extractedAddress);
                        const geoData = await geocodeAddressWithGoogle(extractedAddress);
                        latitude = geoData?.latitude ? geoData.latitude.toString() : null;
                        longitude = geoData?.longitude ? geoData.longitude.toString() : null;
                        formattedAddress = geoData?.formattedAddress ?? null;
                    } catch (geoError) {
                        console.warn(`⚠️ 住所の緯度経度取得に失敗: ${extractedAddress}`);
                    }
                } else {
                    console.warn(`⚠️ 住所情報が見つかりませんでした: ${newsItem.title}`);
                }

                //  ニュースの要約（キャッチコピー）を生成
                const summary = await generateSummary(newsItem.content);

                //  ニュースのジャンルを分類
                const category = await classifyNews(newsItem.content);

                //  `NewsResponse` に格納
                const newsData: NewsResponse ={
                    title: newsItem.title,
                    description: newsItem.description, 
                    content: newsItem.content,
                    url: newsItem.url,
                    image: newsItem.image,
                    publishedAt: new Date(newsItem.publishedAt),
                    createdAt: new Date(),
                    source: {
                        name: newsItem.source.name,
                        url: newsItem.source.url
                    },
                    latitude: latitude ?? '',
                    longitude: longitude ?? '',
                    formattedAddress: formattedAddress ?? '',
                    category: category,
                    summary: summary
                };

                await saveToDatabase(newsData);
                

            } catch (error) {
                console.error(`❌ ニュース処理中にエラー発生: ${newsItem.title}`, error);
            }
        }

    } catch (error) {
        console.error("❌ ニュース取得時にエラー発生:", error);
    }
};
cron.schedule("0 * * * *", processGoutouNews);
cron.schedule("0 * * * *", processSatujinNews);
cron.schedule("0 * * * *", processJikoNews);
console.log("✅ 定期実行スクリプトが開始しました...");