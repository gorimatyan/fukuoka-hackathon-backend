import { JsonController, Get, QueryParams } from "routing-controllers";
import { TwitterService } from "../services/twitter-service";
import { Service } from "typedi";
import { TweetResponse, GetTweetsQuery } from "../models/TweetModel";

@Service()
@JsonController("/twitter")
export class TwitterController {
    constructor(private twitterService: TwitterService) {}

    @Get("/tweets")
    async getTweets(@QueryParams() query: GetTweetsQuery): Promise<{ data: TweetResponse[] } | { error: string }> {
        console.log(" 受け取ったクエリパラメータ:", query);

        if (!query.groups) {
            return { error: "検索キーワード (groups) が必要です。" };
        }

        try {

            // Twitter API v2 でツイート取得
            const tweets = await this.twitterService.fetchTweets(query);
            return { data: tweets };

        } catch (error) {
            console.error("Twitter API の取得エラー:", error);
            return { error: "ツイートの取得に失敗しました。" };
        }
    }

    @Get("/tweet")
    async getTweet(@QueryParams() query: GetTweetsQuery): Promise<{ data: TweetResponse[] }> {
        console.log("[Debug] 受け取ったクエリパラメータ:", query);
        return { 
            data: [
                { id: "1", text: "テストツイート1", createdAt: new Date().toISOString() },
                { id: "2", text: "テストツイート2", createdAt: new Date().toISOString() }
            ] 
        };
    }
}