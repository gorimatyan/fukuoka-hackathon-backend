import axios from 'axios';
import env from '../config/env';

const API_KEY = env.GOOGLE_GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

/**
 * ニュース記事のテキストから住所情報を抽出
 * @param text ニュース記事のテキスト
 * @returns {Promise<{ locations: { name: string, type: string, details: string }[] }>} 住所情報
 */
export async function extractLocation(text: string): Promise<{ extractedLocation: string }> {
    try {
        const response = await axios.post(URL, {
            contents: [{
                parts: [{
                    text: `次のニュース記事からニュース記事のトピックの重要な場所の情報を１つ抽出してください: \n\n${text}\n\n出力は **JSON形式** で返してください。JSON以外の情報は含めないでください。`
                }]
            }]
        });

        console.log('📍 Gemini API フルレスポンス:', JSON.stringify(response.data, null, 2));

        // APIレスポンスの確認
        if (!response.data?.candidates || response.data.candidates.length === 0) {
            throw new Error('APIレスポンスにcandidatesが含まれていません');
        }

        const candidate = response.data.candidates[0];

        if (!candidate?.content?.parts || candidate.content.parts.length === 0) {
            throw new Error('APIレスポンスにcontent.partsが含まれていません');
        }

        let extractedData = candidate.content.parts[0].text;

        if (!extractedData) {
            throw new Error('住所情報が見つかりませんでした');
        }

        // MarkdownのJSONコードブロック (` ```json ... `) を削除
        extractedData = extractedData.replace(/```json\n?/, '').replace(/```\n?/, '').trim();

        // JSONとしてパース
        let locationData;
        try {
            locationData = JSON.parse(extractedData);
        } catch (error) {
            throw new Error('JSONのパースに失敗しました');
        }

        // "場所" または "location" のどちらかを取得
        const extractedLocation = locationData.場所 || locationData.location;
        if (!extractedLocation) {
            throw new Error('有効な住所情報が取得できませんでした');
        }

        return { extractedLocation };

    } catch (error) {
        console.error('❌ APIエラー:', error instanceof Error ? error.message : error);
        throw new Error('位置情報の取得に失敗しました');
    }
}


/**
 * ニュースの内容から、要約キャッチコピーを作成
 * キャッチコピーは「最大50文字以内」で短く要約
 */
export async function generateSummary(text: string): Promise<string> {
    try {
        const response = await axios.post(URL, {
            contents: [{
                parts: [{
                    text: `次のニュース記事の要約キャッチコピーを作成してください。\n\n
                    🔹 **ルール:**\n
                    - 50文字以内の短い要約
                    - ニュースの核心を伝える\n
                    - 簡潔で分かりやすい表現にする\n\n
                    **出力形式:** JSON で **{ "summary": "キャッチコピー" }** のみ返してください。\n\n
                    ---\n
                    ニュース記事:\n\n${text}`
                }]
            }]
        });

        console.log('📝 要約キャッチコピーレスポンス:', JSON.stringify(response.data, null, 2));

        // APIレスポンスの確認
        if (!response.data?.candidates || response.data.candidates.length === 0) {
            throw new Error('APIレスポンスにcandidatesが含まれていません');
        }

        const candidate = response.data.candidates[0];

        if (!candidate?.content?.parts || candidate.content.parts.length === 0) {
            throw new Error('APIレスポンスにcontent.partsが含まれていません');
        }

        let summaryData = candidate.content.parts[0].text;

        if (!summaryData) {
            throw new Error('要約キャッチコピーが見つかりませんでした');
        }

        // MarkdownのJSONコードブロック (` ```json ... `) を削除
        summaryData = summaryData.replace(/```json\n?/, '').replace(/```\n?/, '').trim();

        // JSONとしてパース
        const parsedSummary = JSON.parse(summaryData);
        if (!parsedSummary || !parsedSummary.summary) {
            throw new Error('要約キャッチコピーの抽出に失敗しました');
        }

        return parsedSummary.summary;

    } catch (error) {
        console.error('❌ APIエラー:', error instanceof Error ? error.message : error);
        throw new Error('要約キャッチコピーの生成に失敗しました');
    }
}


/**
 * ニュースの内容を指定したジャンルに分類
 * 分類ジャンル: 殺人・窃盗・詐欺・事故・火災・その他
 */
export async function classifyNews(text: string): Promise<string> {
    try {
        const response = await axios.post(URL, {
            contents: [{
                parts: [{
                    text: `次のニュース記事を以下のいずれかのジャンルに分類してください。\n\n
                    「殺人」「窃盗」「詐欺」「事故」「火災」\n\n
                    どのジャンルにも該当しない場合は「なし」としてください。\n\n
                    出力は **JSON形式** で返してください。JSON以外の情報は含めないでください。\n\n
                    { "category": "ジャンル名" }\n\n
                    ニュース記事:\n\n${text}`
                }]
            }]
        });

        console.log('📰 ニュース分類レスポンス:', JSON.stringify(response.data, null, 2));

        // APIレスポンスの確認
        if (!response.data?.candidates || response.data.candidates.length === 0) {
            throw new Error('APIレスポンスにcandidatesが含まれていません');
        }

        const candidate = response.data.candidates[0];

        if (!candidate?.content?.parts || candidate.content.parts.length === 0) {
            throw new Error('APIレスポンスにcontent.partsが含まれていません');
        }

        let genreData = candidate.content.parts[0].text;

        if (!genreData) {
            throw new Error('ジャンルが見つかりませんでした');
        }

        // MarkdownのJSONコードブロック (` ```json ... `) がある場合、それを削除
        genreData = genreData.replace(/```json\n?/, '').replace(/```\n?/, '').trim();

        // JSONとしてパース
        let parsedGenre: { category: string } | null = null;
        try {
            parsedGenre = JSON.parse(genreData);
        } catch (error) {
            console.warn('⚠️ JSONのパースに失敗しました:', error);
            return "なし";  // JSONがパースできなかった場合も "なし"
        }

        // 期待するキーがない場合や、不適切な値の場合 "なし" を返す
        const validCategories = ["殺人", "窃盗", "詐欺", "事故", "火災", "なし"];
        if (!parsedGenre || !parsedGenre.category || !validCategories.includes(parsedGenre.category)) {
            return "なし";
        }

        return parsedGenre.category;

    } catch (error) {
        console.error('❌ APIエラー:', error instanceof Error ? error.message : error);
        return "なし";  // 失敗時も "なし" を返す
    }
}