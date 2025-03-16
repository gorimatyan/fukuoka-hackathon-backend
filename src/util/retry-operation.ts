// src/util/retry-utils.ts
/**
 * 指定された操作を実行し、失敗した場合は指定回数まで再試行する
 * @param operation 実行する非同期操作
 * @param retries 再試行回数（デフォルト: 3）
 * @param delay 再試行までの待機時間（ミリ秒、デフォルト: 1000）
 * @returns 操作の結果
 */
export async function retryOperation<T>(
    operation: () => Promise<T>,
    retries = 3,
    delay = 1000
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries <= 0) throw error;
      
      console.warn(`操作に失敗しました。${delay}ms後に再試行します...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return retryOperation(operation, retries - 1, delay * 2);
    }
  }