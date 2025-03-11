import { Service } from "typedi";
import { prisma } from "../config/prisma";
import { MapAnnotationData } from "../models/MapAnnotationDataModel";
import { convertFireDataToMapAnnotationData } from "../util/convertToMapAnnotationData";


/**
 * @class FireTrucksService
 * @description 火災に関する消防車の情報を取得するサービスクラス
 */
@Service()
export class FireTrucksService {
    /**
     * @method getFireTrucks
     * @description 過去2時間以内に受信したメールを取得します。
     * @returns {Promise<Array>} 火災に関するメールの配列を返します。
     */
    async getFireTrucks(): Promise<MapAnnotationData[]> {
        const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
        const data = await prisma.email.findMany({
            where: {
                receivedAt: {
                    gte: oneHourAgo,
                },
            },
        });
        return data.map(convertFireDataToMapAnnotationData);
    }

    /**
     * @method getFireTrucksByType
     * @description 指定された災害タイプに基づいて火災に関するメールを取得します。
     * @param {string} type - 災害のタイプ
     * @returns {Promise<Array>} 指定された災害タイプに関するメールの配列を返します。
     */
    async getFireTrucksByType(type: string): Promise<MapAnnotationData[]> {
        const data = await prisma.email.findMany({
            where: {
                disasterType: type,
            },
        });
       
            
        return data.map(convertFireDataToMapAnnotationData);;
    }

    /**
     * @method getFireTrucksByPeriod
     * @description 指定された期間内に受信した火災に関するメールを取得します。
     * @param {Date} start - 期間の開始日時
     * @param {Date} end - 期間の終了日時
     * @returns {Promise<Array>} 指定された期間内に受信したメールの配列を返します。
     */
    async getFireTrucksByPeriod(start: Date, end: Date): Promise<MapAnnotationData[]> {
        const data = await prisma.email.findMany({
            where: {
                receivedAt: {
                    gte: start,
                    lte: end,
                },
            },
        });
        return data.map(convertFireDataToMapAnnotationData);;
    }
}
