import { JsonController, Get, QueryParams } from "routing-controllers";
import { Service } from "typedi";
import { FireTrucksService } from "../services/fire-trucks-service";
import { GetFireTrucksByTypeParams, GetFireTrucksByPeriodParams } from "../models/FireTrucksModel";
import { MapAnnotationData } from "../models/MapAnnotationDataModel";

/**
 * @class FireTrucksController
 * @description 消防車に関するAPIコントローラー
 */
@Service()
@JsonController("/fire-trucks")
export class FireTrucksController {

    /**
     * @constructor
     * @param {FireTrucksService} fireTrucksService - 消防車サービス
     */
    constructor(private fireTrucksService: FireTrucksService ) {}

    /**
     * @method getFireTrucks
     * @summary 消防の位置情報を取得するAPI
     * @description 消防の位置情報を取得するAPI
     * @returns {Promise<MapAnnotationData[]>} 消防の位置情報
     */
    @Get("/missions")
    async getFireTrucks(): Promise<MapAnnotationData[]> {
        const data = await this.fireTrucksService.getFireTrucks();
        return data;
    }

    /**
     * @method getFireTrucksByType
     * @summary 種別を指定して消防の位置情報を取得するAPI
     * @description 種別を指定して消防の位置情報を取得するAPI
     * @param {GetFireTrucksByTypeParams} params - クエリパラメータ
     * @returns {Promise<MapAnnotationData[]>} 指定された種別の消防の位置情報
     */
    @Get("/missions/by-type")
    async getFireTrucksByType(@QueryParams() params: GetFireTrucksByTypeParams): Promise<MapAnnotationData[]> {
        const data = await this.fireTrucksService.getFireTrucksByType(params.type);
        return data;
    }

    /**
     * @method getFireTrucksByPeriod
     * @summary 期間を指定して消防の位置情報を取得するAPI
     * @description 期間を指定して消防の位置情報を取得するAPI
     * @param {GetFireTrucksByPeriodParams} params - クエリパラメータ
     * @returns {Promise<FireTrucksResponse>} 指定された期間の消防の位置情報
     */
    @Get("/missions/by-period")
    async getFireTrucksByPeriod(@QueryParams() params: GetFireTrucksByPeriodParams): Promise<MapAnnotationData[]> {
        const data = await this.fireTrucksService.getFireTrucksByPeriod(new Date(params.start), new Date(params.end));
        return data;
    }
}