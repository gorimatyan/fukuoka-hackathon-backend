import dotenv from 'dotenv';
import { cleanEnv, str, num, url } from 'envalid';
import path from 'path';

// .env ファイルを読み込む
dotenv.config({ path: path.resolve(__dirname, '../../.env') });


// 環境変数のバリデーションと型付け
const env = cleanEnv(process.env, {
    PORT: num({ default: 3001 }),
    NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),
    SERVER_URL: url({ default: 'http://localhost:3001' }),
    API_PREFIX: str(),

    // Prisma
    DB_HOST: str(),
    DB_PORT: num(),
    DB_USER: str(),
    DB_PASS: str(),
    DB_NAME: str(),

    // Google
    GOOGLE_MAPS_API_KEY: str(),

    // Twitter APIの設定
    TWITTER_API_KEY: str(),
    TWITTER_API_SECRET_KEY: str(),
    TWITTER_ACCESS_TOKEN: str(),
    TWITTER_ACCESS_TOKEN_SECRET: str(),

    // Gemini APIの設定
    GOOGLE_GEMINI_API_KEY: str(),

    // IMAPの設定
    IMAP_USER: str(),
    IMAP_PASS: str(),
    IMAP_HOST: str(),
    IMAP_PORT: num(),

    // News APIの設定
    GNEWS_API_KEY: str(),
});

export default env;