import puppeteer, { Browser, PuppeteerNode } from "puppeteer";
import { News } from "../models/NewsModel";
import { retryOperation } from "../util/retry-operation";

/**
 * RKBオンラインからニュースをスクレイピング
 * @param keywords 検索キーワード（配列）
 * @param periodInDays 過去何日以内のニュースを取得するか
 * @returns ニュース記事リスト
 */
export async function fetchNews(keywords: string[], periodInDays: number): Promise<News[]> {
  try {
    // RKBオンラインからニュースをスクレイピング
    const news = await fetchNewsFromRKBOnline(keywords, periodInDays);
    return news;
  } catch (error) {
    console.error('RKBオンラインのスクレイピング中にエラーが発生しました:', error);
    return [];
  }
}

/**
 * RKBオンラインからニュースをスクレイピング
 * @param keywords 検索キーワード（配列）
 * @param periodInDays 過去何日以内のニュースを取得するか
 * @returns ニュース記事リスト
 */
async function fetchNewsFromRKBOnline(keywords: string[], periodInDays: number): Promise<News[]> {
//   console.log(`🔍 RKBオンラインのスクレイピング開始: キーワード「${keywords.join(' ')}」`);
  
  // 複数ページからのニュース記事を格納する配列
  const allNewsItems: News[] = [];
  
  // スクレイピングするページのURL
  const baseUrl = "https://newsdig.tbs.co.jp/list/rkb/latest";
  const urls = [
    baseUrl,
    `${baseUrl}?page=2`,
    `${baseUrl}?page=3`
  ];
  
  let browser;
  try {
    // ブラウザの起動をリトライ機能付きで実行
    console.log('🚀 Puppeteerブラウザを起動中...');
    browser = await retryOperation<Browser>(
      () => puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }),
      3,  // 3回まで再試行
      2000 // 初回の再試行までの待機時間は2秒
    );
    console.log('✅ ブラウザ起動成功');
    
    const page = await browser.newPage();
    
    // ユーザーエージェントを設定
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // 昨日の日付を取得（日本時間）
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    // 各ページを処理
    for (const url of urls) {
      console.log(`🌐 ページにアクセス中: ${url}`);
      
      // ページへのアクセスをリトライ機能付きで実行
      await retryOperation(
        () => page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }),
        3,
        2000
      );
      console.log('✅ ページアクセス成功');
      
      // スクリーンショットを撮影（デバッグ用）
      await page.screenshot({ path: `rkb-online-page-${urls.indexOf(url) + 1}.png` });
      console.log(`📸 スクリーンショット撮影: rkb-online-page-${urls.indexOf(url) + 1}.png`);
      
      // 記事要素を取得
      console.log('🔎 ニュース記事の要素を抽出中...');
      const pageNewsItems = await retryOperation(
        () => page.evaluate((yesterdayTimestamp) => {
          console.log('🔍 ページ内のarticle要素を検索中...');
          const articles = Array.from(document.querySelectorAll('article.m-article-row'));
          console.log(`📊 ${articles.length}件の記事要素を発見`);
          
          return articles.map(article => {
            // タイトル
            const titleElement = article.querySelector('h3.m-article-content__title');
            const title = titleElement ? titleElement.textContent?.trim() : '';
            
            // 説明文（タイトルと同じ）
            const description = title;
            
            // URL
            const linkElement = article.querySelector('a.m-article-inner');
            const relativeUrl = linkElement ? linkElement.getAttribute('href') : '';
            const url = relativeUrl ? `https://newsdig.tbs.co.jp${relativeUrl}` : '';
            
            // 公開日時
            const timeElement = article.querySelector('time');
            let publishedAt = timeElement ? timeElement.getAttribute('datetime') : null;
            if (!publishedAt) {
              publishedAt = new Date().toISOString();
            }
            
            // 公開日時のタイムスタンプを取得
            const publishedTimestamp = new Date(publishedAt).getTime();
            
            // 画像
            const imageElement = article.querySelector('img');
            const image = imageElement ? imageElement.getAttribute('src') : '';
            
            // ソース名（RKB毎日放送で固定）
            const sourceName = 'RKB毎日放送';
            
            return {
              title,
              description,
              url,
              image,
              publishedAt,
              publishedTimestamp,
              sourceName
            };
          }).filter(item => {
            // タイトルとURLがある記事のみ
            if (!item.title || !item.url) return false;
            
            // 昨日の記事のみをフィルタリング
            return item.publishedTimestamp >= yesterdayTimestamp;
          });
        }, yesterday.getTime())
      );
      
      console.log(`📊 ${pageNewsItems.length}件のニュース記事を抽出しました`);
      
      // キーワードでフィルタリング
    //   const filteredNewsItems = pageNewsItems.filter((item) => {
    //     // キーワードが指定されていない場合はすべての記事を返す
    //     if (keywords.length === 0) return true;
        
    //     // タイトルにキーワードが含まれているかチェック
    //     return keywords.some(keyword => 
    //       item.title?.toLowerCase().includes(keyword.toLowerCase()) ?? false
    //     );
    //   });
      
    //   console.log(`📊 キーワードでフィルタリング後: ${filteredNewsItems.length}件`);
      
      // 結果を配列に追加
      for (const item of pageNewsItems) {
        allNewsItems.push({
          id: 0,
          title: item.title ?? '',
          description: item.description ?? '',
          content: item.description ?? '', // 一覧ページでは本文は取得できないので説明文（タイトル）を使用
          url: item.url ?? '',
          image: item.image ?? '',
          publishedAt: new Date(item.publishedAt),
          createdAt: new Date(),
          source: {
            name: item.sourceName,
            url: item.url
          }
        });
      }
    }
    
    console.log(`✅ スクレイピング完了: 合計${allNewsItems.length}件のニュース記事を取得しました`);
    
    // 記事の詳細情報を取得
    if (allNewsItems.length > 0) {
      console.log('🔄 記事の詳細情報を取得します...');
      
      const maxArticles = Math.min(10, allNewsItems.length); // 最大10件まで処理
      
      for (let i = 0; i < maxArticles; i++) {
        const item = allNewsItems[i];
        console.log(`🔍 記事[${i + 1}/${maxArticles}] "${item.title.substring(0, 30)}..." の詳細を取得中...`);
        
        try {
          // 記事の詳細ページにアクセス
          console.log(`🌐 記事URL: ${item.url} にアクセス中...`);
          await retryOperation(
            () => page.goto(item.url, { waitUntil: 'networkidle2', timeout: 30000 }),
            2,
            1500
          );
          
          // 記事の本文を取得
          console.log('📝 記事の本文を抽出中...');
          const content = await retryOperation(
            () => page.evaluate(() => {
              // 記事本文のセレクタ
              const articleBodyElement = document.querySelector('.article-body');
              if (!articleBodyElement) return '';
              
              // 本文内のすべてのpタグを取得
              const paragraphs = Array.from(articleBodyElement.querySelectorAll('p'));
              
              // 各段落のテキストを取得し、広告を除外
              const paragraphTexts = paragraphs.map(p => {
                // pタグのクローンを作成して広告要素を削除
                const pClone = p.cloneNode(true) as HTMLElement;
                
                // 広告要素を削除
                const adElements = pClone.querySelectorAll('.insert_ads');
                adElements.forEach(ad => ad.parentNode?.removeChild(ad));
                
                // テキストを取得（HTMLタグを含む）
                return pClone.innerHTML
                  // brタグを改行に置換
                  .replace(/<br\s*\/?>/gi, '\n')
                  // その他のHTMLタグを削除
                  .replace(/<\/?[^>]+(>|$)/g, '')
                  // 連続する改行を1つにまとめる
                  .replace(/\n+/g, '\n')
                  // 前後の空白を削除
                  .trim();
              });
              
              // 空の段落を除外して結合
              return paragraphTexts
                .filter(text => text.trim() !== '')
                .join('\n\n');
            })
          );
          
          if (content && content.trim() !== '') {
            allNewsItems[i].content = content;
            console.log(`✅ 記事の本文を取得しました (${content.length}文字)`);
            console.log(`📝 本文サンプル: ${content.substring(0, 100)}...`);
          } else {
            console.warn('⚠️ 記事の本文が抽出できませんでした。タイトルを使用します。');
          }
          
          // 連続アクセスによるブロックを避けるため少し待機
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`❌ 記事[${i + 1}/${maxArticles}] "${item.title}" の詳細取得中にエラー:`, error);
        }
      }
    }
    
    return allNewsItems;
    
  } catch (error) {
    console.error('❌ RKBオンラインスクレイピング中にエラーが発生しました:', error);
    throw error;
  } finally {
    if (browser) {
      console.log('🔄 ブラウザを終了します...');
      await browser.close();
      console.log('✅ ブラウザ終了完了');
    }
  }
}