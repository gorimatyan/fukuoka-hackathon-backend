import axios from 'axios';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * 住所を緯度経度に変換する関数（Nominatim使用）
 */
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  try {
    // 🔸 ここで1秒間待機（リクエストのレート制限対応）
    await new Promise(resolve => setTimeout(resolve, 2000));
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'MyGeocodingApp/1.0 (https://example.com)',
      }
    });

    console.log('🔍APIの生レスポンス:', response.data); 

    if (response.data.length > 0) {
      const location = response.data[0];
      return {
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon),
      };
    }

    return null;
  } catch (error) {
    console.error('ジオコーディングエラー:', error);
    return null;
  }
}