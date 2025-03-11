import { JsonController, Get, QueryParam } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { NewsService } from "../services/news-service";
import { Service } from "typedi";
import { NewsResponse } from "../models/NewsModel";
import { MapAnnotationData } from "../models/CommonResponseModel";

@Service()
@JsonController("/news")
export class NewsController {
    constructor(private newsService: NewsService) {}

    /**
     * ニュース記事のデータ情報の一覧を取得
     * @param - なし
     * @returns {Promise<{data: MapAnnotationData[]}>} ニュース記事のデータ情報の一覧
     */
    @Get("/")
    async getNews(): Promise<MapAnnotationData[] | { error: string }> {
        const news = await this.newsService.getNews();
        return news ;
    }
}