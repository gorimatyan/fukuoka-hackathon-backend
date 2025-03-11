/**
 * 消防車の情報を表すインターフェース。
 * 
 * @property {number} id - 消防車の一意の識別子。
 * @property {string} from - メッセージの送信元。
 * @property {string} subject - メッセージの件名。
 * @property {string} body - メッセージの本文。
 * @property {string} disasterType - 災害の種類。
 * @property {string} address - 災害の発生場所の住所。
 * @property {Date} receivedAt - メッセージを受信した日時。
 * @property {number | null} [latitude] - 災害発生場所の緯度（オプション）。
 * @property {number | null} [longitude] - 災害発生場所の経度（オプション）。
 * @property {Date} createdAt - データが作成された日時。
 */
export interface FireTruck {
    id: number;
    from: string;
    subject: string;
    body: string;
    disasterType: string;
    address: string;
    receivedAt: Date;
    latitude?: number | null;
    longitude?: number | null;
}

/**
 * 指定された種類の消防車を取得するためのパラメータを表します。
 */
export interface GetFireTrucksByTypeParams {
    type: string;
}

/**
 * 指定された期間内の消防車を取得するためのパラメータを表します。
 * 
 * @property {string} start - 期間の開始日を表す文字列。
 * @property {string} end - 期間の終了日を表す文字列。
 */
export interface GetFireTrucksByPeriodParams {
    start: string;
    end: string;
}
