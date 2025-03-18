# 漢のハッカソン Project

## プロジェクト概要
このプロジェクトは、リアルタイム情報をマップ上に表示する機能を持ちます。ニュース、事件・事故情報をスクレイピングし、位置情報を抽出して地図上に可視化します。

## 依存関係
- node :
  - node -v
    v22.14.0

- PostgreSQL:
  - postgres --version
    14.16

## インストール手順（Mac）

### Node.js
1. Node.jsをインストールします。
```bash
brew install node
```

2. バージョンを確認します。
```bash
node -v
```

### PostgreSQL
1. PostgreSQLをインストールします。
```bash
brew install postgresql
```

2. バージョンを確認します。
```bash
postgres --version
```

3. PostgreSQLを起動します。
```bash
brew services start postgresql
```
4. PostgreSQLにログインします。
```bash
psql postgres
```
5. 新しいユーザーを作成します
```bash
CREATE USER your_username WITH PASSWORD 'your_password';
```
6. データベースを作成します
```bash
createdb your_database_name //好きな名前
```
7. データベースを作成し、ユーザーに権限を付与します
```bash
CREATE DATABASE your_database_name;
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_username;
```
## 環境変数
`.env`ファイルに以下の環境変数を設定します。
```
backend/.env.sampleを参照
```

## Prisma実行
1. Prisma CLIとPrisma Clientをインストールします。
```bash
npm install prisma --save-dev
npm install @prisma/client
```
<!-- 2. Prismaを初期化します。
```bash
npx prisma init
``` -->
3. Prismaのマイグレーションを実行してデータベーススキーマを作成します。
```bash
npx prisma db push
npx prisma generate
```
4. DBデータの追加
```bash
npx ts-node prisma/seed.ts
```

## プロジェクトの起動
以下のコマンドでプロジェクトを起動します。
```bash
npm run dev
```
※imap（Gmail）の設定をしていない場合は、server.tsの```startEmailListener();```をコメントアウトしてください。

DBの確認方法
```bash
npx prisma studio
```

## ディレクトリ構造と各コンポーネントの役割

```
/
├── prisma/                      # Prisma ORM関連ファイル
│   ├── migrations/              # データベースマイグレーションファイル
│   ├── schema.prisma            # データベーススキーマ定義
│   └── seed.ts                  # テストデータ投入スクリプト
│
├── src/                         # ソースコード
│   ├── config/                  # 設定ファイル
│   │   ├── env.ts               # 環境変数の管理
│   │   ├── imap.ts              # メール受信設定
│   │   ├── prisma.ts            # Prismaクライアント設定
│   │   └── twitter.ts           # Twitter API設定
│   │
│   ├── controllers/             # APIエンドポイントのコントローラー
│   │   ├── fire-trucks-controller.ts  # 消防車情報のAPI
│   │   ├── news-controller.ts         # ニュース情報のAPI
│   │   └── twitter-controller.ts      # Twitter情報のAPI
│   │
│   ├── middlewares/             # 外部APIとの連携処理
│   │   ├── email-receiver.ts    # メール受信処理
│   │   ├── fukuoka-news.ts      # RKBニュースのスクレイピング
│   │   ├── gemini_ai.ts         # Google Gemini AIとの連携
│   │   ├── geocoding.ts         # OpenStreetMapジオコーディング
│   │   ├── gnews.ts             # GNewsAPIとの連携
│   │   ├── google-geocoding.ts  # Google Mapsジオコーディング
│   │   └── saveToDatabase.ts    # データベース保存処理
│   │
│   ├── models/                  # データモデル定義
│   │   ├── FireTrucksModel.ts   # 消防車情報のモデル
│   │   ├── MapAnnotationDataModel.ts  # マップ注釈データのモデル
│   │   ├── NewsModel.ts         # ニュース情報のモデル
│   │   └── TweetModel.ts        # ツイート情報のモデル
│   │
│   ├── services/                # ビジネスロジック
│   │   ├── fire-trucks-service.ts  # 消防車情報の処理
│   │   ├── news-service.ts         # ニュース情報の処理
│   │   └── twitter-service.ts      # Twitter情報の処理
│   │
│   ├── util/                    # ユーティリティ関数
│   │   ├── convertToMapAnnotationData.ts  # マップデータ変換
│   │   ├── news-cron.ts         # ニュース定期取得処理
│   │   └── retry-operation.ts   # リトライ処理
│   │
│   ├── app.ts                   # Expressアプリケーション設定
│   └── server.ts                # サーバー起動スクリプト
│
├── .env                         # 環境変数ファイル
├── .env.sample                  # 環境変数サンプルファイル
├── package.json                 # プロジェクト依存関係
├── tsconfig.json                # TypeScript設定
└── swagger.yaml                 # API仕様書
```

## 各ディレクトリの役割

### `/prisma`
Prisma ORMに関連するファイルを格納しています。データベースのスキーマ定義、マイグレーション、シードデータが含まれます。

- **schema.prisma**: データベースのテーブル構造とリレーションシップを定義
- **migrations/**: データベーススキーマの変更履歴
- **seed.ts**: 初期データを投入するスクリプト

### `/src/config`
アプリケーションの設定ファイルを格納しています。

- **env.ts**: 環境変数の読み込みと検証
- **imap.ts**: メール受信のための設定
- **prisma.ts**: Prismaクライアントのインスタンス化
- **twitter.ts**: Twitter APIの認証情報

### `/src/controllers`
HTTPリクエストを受け取り、適切なサービスを呼び出すコントローラーを格納しています。

- **fire-trucks-controller.ts**: 消防車情報のAPIエンドポイント
- **news-controller.ts**: ニュース情報のAPIエンドポイント
- **twitter-controller.ts**: Twitter情報のAPIエンドポイント

### `/src/middlewares`
※コントローラーからは呼び出してはいけない
外部APIとの連携や、データ処理のミドルウェアを格納しています。

- **email-receiver.ts**: メールサーバーからのメール受信処理
- **fukuoka-news.ts**: RKBニュースサイトからのスクレイピング
- **gemini_ai.ts**: Google Gemini AIを使った自然言語処理
- **geocoding.ts**: OpenStreetMapを使った住所→座標変換
- **gnews.ts**: GNews APIからのニュース取得
- **google-geocoding.ts**: Google Maps APIを使った住所→座標変換
- **saveToDatabase.ts**: 取得したデータのデータベース保存処理

### `/src/models`
アプリケーションで使用するデータモデルの型定義を格納しています。

- **FireTrucksModel.ts**: 消防車情報のデータ構造
- **MapAnnotationDataModel.ts**: マップ上の注釈データの構造
- **NewsModel.ts**: ニュース記事のデータ構造
- **TweetModel.ts**: ツイートのデータ構造

### `/src/services`
データの取得を実装するサービスを格納しています。

- **fire-trucks-service.ts**: 消防車情報の取得
- **news-service.ts**: ニュース情報の取得
- **twitter-service.ts**: Twitter情報の取得

### `/src/util`
汎用的なユーティリティ関数を格納しています。

- **convertToMapAnnotationData.ts**: 各種データをマップ表示用に変換
- **news-cron.ts**: ニュースの定期取得処理
- **retry-operation.ts**: 外部API呼び出しのリトライ処理

## ディレクトリ間の依存関係

プロジェクト内のディレクトリ間には以下のような依存関係があります：

```
server.ts → app.ts → controllers → services → prisma(config) → データベース
                   ↘                ↗           ↓
                     util ← middlewares → 外部API/サービス
```

### 主な依存フロー

1. **エントリーポイント**:
   - `server.ts`: アプリケーションのエントリーポイント。`app.ts`をインポートしてHTTPサーバーを起動し、メール受信リスナーを開始します。
   - `app.ts`: Expressアプリケーションの設定とルーティングを行います。`routing-controllers`ライブラリを使用して`controllers`ディレクトリ内のコントローラーを自動的に登録します。
   ```typescript
   // app.tsの重要な部分
   useExpressServer(app, {
       routePrefix: env.API_PREFIX || "/api",
       controllers: [__dirname + "/controllers/*.ts"],
   });
   ```

2. **APIリクエスト処理フロー**:
   - `controllers`: クライアントからのリクエストを受け取り、適切な`services`を呼び出します。`routing-controllers`のデコレータを使用してルートを定義します。
   - `services`: ビジネスロジックを実装し、主にデータベース操作を行います。外部データ取得は直接行わず、データの変換や整形を担当します。
   - `middlewares`: 外部APIとの連携や、データ処理を行い、結果を`models`の形式で返します。主にデータ収集と前処理を担当します。

3. **データモデル**:
   - `models`: アプリケーション全体で使用されるデータ構造を定義します。ほぼすべてのディレクトリから参照されます。

4. **設定と共通機能**:
   - `config`: 環境変数やデータベース接続など、アプリケーション全体の設定を提供します。多くのディレクトリから参照されます。
   - `util`: 汎用的なユーティリティ関数を提供し、様々なディレクトリから使用されます。

### 定期実行処理
   - `util/news-cron.ts`: `middlewares`の各種機能を使用してニュース情報を定期的に取得・処理します

### アーキテクチャの特徴

このプロジェクトでは、以下のような責任分担が行われています：

- **middlewares**: 外部データソース（ニュースサイト、Twitter、メールなど）からのデータ取得と前処理（※コントローラーからは呼び出してはいけない）
- **services**: データベースからのデータ取得と、APIレスポンス用のデータ整形
- **controllers**: クライアントリクエストの処理とレスポンスの返却
- **util**: 共通機能の提供（データ変換、リトライ処理、定期実行など）

この依存関係の構造により、関心の分離が実現され、コードの保守性と拡張性が向上しています。

## 主要な機能

1. **ニュース情報収集**:
   - RKBニュースサイトからのスクレイピング
   - GNews APIからのニュース取得
   - Google Gemini AIを使った記事の分類と要約

2. **位置情報処理**:
   - 住所テキストからの位置情報抽出
   - Google MapsとOpenStreetMapを使った座標変換

3. **データ可視化**:
   - 収集したデータをマップ上に表示するためのAPI提供

4. **定期実行**:
   - ニュース情報の定期的な取得と処理

5. **エラーハンドリング**:
   - 外部API呼び出しのリトライ処理
   - エラーログの出力

## 外部API連携

- **Google Maps API**: 住所→座標変換
- **Google Gemini AI**: テキスト分析、要約生成
- **Twitter API**: ツイート取得
- **GNews API**: ニュース記事取得
- **IMAP**: メール受信

## データフロー

1. 外部ソース（ニュースサイト、Twitter、メール）からデータを取得
2. 取得したデータを処理（位置情報抽出、分類、要約）
3. 処理したデータをデータベースに保存
4. APIを通じてフロントエンドにデータを提供

## xのAPIリファレンス
https://docs.x.com/x-api/posts/full-archive-search

## OpenStreetMap
src/middlewares/geocoding.ts
町目までしか検索できない。

## Google Maps API
以下を設定
GOOGLE_MAPS_API_KEY=

## アプリケーションの起動時にニュース処理をOFF(npm run dev で起動した場合)
app.tsで以下の行をコメントアウトすることで、起動時のニュース処理を無効化できます：
```javascript
// processGoutouNews().catch(error => {
//   console.error("❌ 初回ニュースGoutou処理中にエラー発生:", error);
// });
// processJikoNews().catch(error => {
//   console.error("❌ 初回ニュースJiko処理中にエラー発生:", error);
// });
// processSatujinNews().catch(error => {
//   console.error("❌ 初回ニュースSatujin処理中にエラー発生:", error);
// });
```

## トラブルシューティング

### スクレイピングが失敗する場合
- ウェブサイトの構造が変更された可能性があります。`fukuoka-news.ts`のセレクタを確認してください。
- デバッグ用のスクリーンショットとHTMLファイルが保存されるので、それらを確認してください。

### 位置情報が取得できない場合
- Google Maps APIキーが正しく設定されているか確認してください。
- 住所テキストが曖昧な場合、位置情報の抽出精度が低下します。

### データベース接続エラー
- PostgreSQLが起動しているか確認してください。
- 環境変数の`DATABASE_URL`が正しく設定されているか確認してください。
