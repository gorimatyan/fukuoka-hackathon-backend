import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";

dotenv.config(); // 環境変数の読み込み

export const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY || "",
    appSecret: process.env.TWITTER_API_SECRET_KEY || "",
    accessToken: process.env.TWITTER_ACCESS_TOKEN || "",
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
});

export const readOnlyTwitterClient = twitterClient.readOnly;