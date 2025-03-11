import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with high-precision coordinates...');


    // データの初期化したい場合はコメントアウトを外す
    // await prisma.email.deleteMany({});
    // await prisma.news.deleteMany({});
    // await prisma.tweet.deleteMany({});

    // 📩 福岡市の災害メールデータ
    await prisma.email.createMany({
        data: [
            {
                from: 'fukushosaigai@m119.city.fukuoka.lg.jp',
                subject: 'ふくしょうめーる',
                body: '中央区天神１丁目で火災のため、消防隊が出動しています。',
                disasterType: '火災',
                address: '中央区天神１丁目',
                receivedAt: new Date(),
                latitude: 33.5902,
                longitude: 130.4017,
                createdAt: new Date(),
            },
            {
                from: 'fukushosaigai@m119.city.fukuoka.lg.jp',
                subject: 'ふくしょうめーる',
                body: '博多区博多駅前で救急のため、消防隊が出動しています。',
                disasterType: '救急',
                address: '博多区博多駅前',
                receivedAt: new Date(),
                latitude: 33.1111,
                longitude: 130.4207,
                createdAt: new Date(),
            },
            {
                from: 'fukushosaigai@m119.city.fukuoka.lg.jp',
                subject: 'ふくしょうめーる',
                body: '東区香椎で警戒のため、消防隊が出動しています。',
                disasterType: '警戒',
                address: '東区香椎',
                receivedAt: new Date(),
                latitude: 34.6603,
                longitude: 130.4413,
                createdAt: new Date(),
            }
        ],
    });

    // 📰 福岡市のニュースデータ
    await prisma.news.createMany({
        data: [
            {
                title: '中央区天神で火災発生',
                description: '中央区天神で火災が発生し、消防隊が出動しています。',
                content: '中央区天神で火災が発生し、消防隊が消火活動を行っています。住民の避難を呼びかけています。',
                url: 'https://example.com/news/fire1',
                image: 'https://example.com/images/fire1.jpg',
                publishedAt: new Date(),
                createdAt: new Date(),
                sourceName: '福岡市消防局',
                sourceUrl: 'https://example.com',
                latitude: '33.5902',
                longitude: '130.4017',
                formattedAddress: '福岡市中央区天神',
                category: '火災',
                summary: '中央区天神で火災が発生し、消防隊が出動しています。'
            },
            {
                title: '博多駅前で救急出動',
                description: '博多駅前で救急のため、消防隊が出動しています。',
                content: '博多駅前で急病人の対応のため、消防隊と救急隊が出動しています。',
                url: 'https://example.com/news/ambulance1',
                image: 'https://example.com/images/ambulance1.jpg',
                publishedAt: new Date(),
                createdAt: new Date(),
                sourceName: '福岡市消防局',
                sourceUrl: 'https://example.com',
                latitude: '33.5895',
                longitude: '130.4207',
                formattedAddress: '福岡市博多区博多駅前',
                category: '救急',
                summary: '博多駅前で救急のため、消防隊が出動しています。'
            },
            {
                title: '福岡市東区で警戒',
                description: '福岡市東区で不審火の警戒のため、消防隊が出動しています。',
                content: '福岡市東区で不審火が相次ぎ、警戒のために消防隊が巡回を強化しています。',
                url: 'https://example.com/news/warning1',
                image: 'https://example.com/images/warning1.jpg',
                publishedAt: new Date(),
                createdAt: new Date(),
                sourceName: '福岡県警察',
                sourceUrl: 'https://example.com',
                latitude: '33.6603',
                longitude: '130.4413',
                formattedAddress: '福岡市東区香椎',
                category: '警戒',
                summary: '福岡市東区で不審火の警戒のため、消防隊が出動しています。'
            },
            {
                title: 'アルサーガ',
                description: 'アルサーガでハッカソン開催',
                content: 'アルサーガでハッカソンが開催していますしています。',
                url: 'https://www.arsaga.jp/',
                image: 'https://example.com/images/warning1.jpg',
                publishedAt: new Date(),
                createdAt: new Date(),
                sourceName: '男のハッカソン',
                sourceUrl: 'https://example.com',
                latitude: '33.5914255',
                longitude: '130.4005981',
                formattedAddress: '福岡市中央区天神１丁目１０−２０',
                category: 'ハッカソン',
                summary: 'アルサーガでハッカソン開催！'
            }
        ],
    });

    // 🐦 福岡市関連のツイートデータ
    await prisma.tweet.createMany({
        data: [
            {
                id: '1898991713013674287',
                text: '🔥 福岡市天神で火災発生！消防隊が急行しています。',
                createdAt: new Date(),
                authorId: '123456',
                authorName: 'NewsBot',
                authorProfile: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
                mediaUrl: null
            },
            {
                id: '1898991711818514642',
                text: '🚑 博多駅前で救急車が出動！道を譲ってください。',
                createdAt: new Date(),
                authorId: '789012',
                authorName: 'EmergencyReport',
                authorProfile: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
                mediaUrl: null
            },
            {
                id: '1898991709926650042',
                text: '⚠️ 東区香椎で警戒中。近隣の方は注意してください。',
                createdAt: new Date(),
                authorId: '345678',
                authorName: 'LocalSafety',
                authorProfile: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
                mediaUrl: 'https://via.placeholder.com/100'
            }
        ],
    });

    console.log('✅ Seeding completed with 福岡市のデータ.');
}

main()
    .catch(async (e) => {
        console.error('❌ Seeding failed:', e);
        await prisma.$disconnect();
    });