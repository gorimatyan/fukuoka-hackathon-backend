import axios from 'axios';
import env from '../config/env';

export interface Coordinates {
  latitude: number;
  longitude: number;
  formattedAddress?: string; 
}

/**
 * Google Geocoding APIを使って住所を緯度経度に変換
 */
export async function geocodeAddressWithGoogle(address: string): Promise<Coordinates | null> {
  const apiKey = env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("❌ APIキーが設定されていません。");
    return null;
  }
  if (!address) throw new Error("住所が提供されていません");
  console.log('🔍住所:', address);

  const url = `https://maps.googleapis.com/maps/api/geocode/json`;

  try {
    const response = await axios.get(url, {
      params: {
        address,
        key: apiKey,
        language: "ja"
      }
    });

    console.log('🔍Google APIの生レスポンス:', response.data);

    if (response.data.status === "OK" && response.data.results.length > 0) {
      const result = response.data.results[0];
      const location = result.geometry.location;
      
      // 国名と郵便番号を除いた住所を構築
      const customFormattedAddress = formatAddressWithoutCountryAndPostalCode(result.address_components);
      console.log('🏠 カスタム住所フォーマット:', customFormattedAddress);

      return {
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: customFormattedAddress,
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Googleジオコーディングエラー:', error);
    return null;
  }
}

/**
 * 住所コンポーネントから国名と郵便番号を除いた住所を構築する
 */
function formatAddressWithoutCountryAndPostalCode(addressComponents: any[]): string {
  if (!addressComponents || !Array.isArray(addressComponents)) {
    return '';
  }

  // 必要なコンポーネントを抽出
  const prefecture = addressComponents.find(comp => 
    comp.types.includes('administrative_area_level_1')
  )?.long_name || '';

  const locality = addressComponents.find(comp => 
    comp.types.includes('locality')
  )?.long_name || '';

  const sublocality1 = addressComponents.find(comp => 
    comp.types.includes('sublocality_level_1')
  )?.long_name || '';

  const sublocality2 = addressComponents.find(comp => 
    comp.types.includes('sublocality_level_2')
  )?.long_name || '';

  const sublocality3 = addressComponents.find(comp => 
    comp.types.includes('sublocality_level_3')
  )?.long_name || '';

  const sublocality4 = addressComponents.find(comp => 
    comp.types.includes('sublocality_level_4')
  )?.long_name || '';

  // 番地など
  const streetNumber = addressComponents.find(comp => 
    comp.types.includes('street_number')
  )?.long_name || '';

  // 追加コンポーネント - 日本の住所体系に合わせて
  const premise = addressComponents.find(comp => 
    comp.types.includes('premise')
  )?.long_name || '';

  const subpremise = addressComponents.find(comp => 
    comp.types.includes('subpremise')
  )?.long_name || '';

  // 住所パーツを配列に入れる
  const addressParts = [];
  
  // 都道府県
  if (prefecture) addressParts.push(prefecture);
  
  // 市区町村
  if (locality) addressParts.push(locality);
  
  // 区
  if (sublocality1) addressParts.push(sublocality1);
  
  // 町名
  if (sublocality2) addressParts.push(sublocality2);
  
  // 丁目
  if (sublocality3) addressParts.push(sublocality3);
  
  // 番地相当
  if (sublocality4) addressParts.push(sublocality4);
  
  // 番地
  if (streetNumber) addressParts.push(streetNumber);
  
  // 建物名など
  if (premise) addressParts.push(premise);
  
  // 部屋番号など
  if (subpremise) addressParts.push(subpremise);

  // 配列を結合して住所文字列を作成
  return addressParts.join('');
}

