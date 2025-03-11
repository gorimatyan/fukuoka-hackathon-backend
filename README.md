# 漢のハッカソン Project

## プロジェクト概要
このプロジェクトは、地震や洪水などの自然災害に関するハザード情報を管理するバックエンドシステムです。TypeORMを使用してデータベースとやり取りし、PostGISを利用して地理空間情報を扱います。

## 依存関係
- node :
  - node -v
    v22.14.0

- PostgreSQL:
  - postgres --version
    14.16

## PostGIS 拡張機能を有効化
  - postgis
  - postgis_topology

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

4. データベースを作成します。
```bash
createdb your_database_name
```

### PostGIS
1. PostGIS拡張機能をインストールします。
```bash
brew install postgis
```

2. データベースにPostGIS拡張機能を追加します。
```sql
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```

## 環境変数
`.env`ファイルに以下の環境変数を設定します。
```
/Users/nobutokai/Documents/projects/Hakson/backend/.env.sampleを参照

```

## マイグレーションの実行
src/config/data-source.tsの設定を変更し、プロジェクトの起動でテーブルが自動生成される。
```bash
npm run dev
```
## DBデータの追加
src/db/dataScript.zshを使用
- 対象データによってコメントアウトの設定をお願いします

## プロジェクトの起動
以下のコマンドでプロジェクトを起動します。
```bash
npm run dev
```

## ディレクトリ構成
```
/backend
├── src/
│   ├── config/         # データベース接続などの設定ファイル
│   ├── controllers/    # リクエストハンドリングとルーティング
│   ├── models/
│   │   ├── dto/       # データ転送オブジェクト
│   │   └── entity/    # データベースエンティティ
│   ├── services/      # ビジネスロジック
│   └── utils/         # ユーティリティ関数
├── .env               # 環境変数設定
├── .env.sample       # 環境変数のサンプル
└── README.md         # プロジェクトドキュメント
```

## 主な機能




# 外部API
GoogleMapsAPI
GeminiAPI
XAPI
GNEWSAPI
IMAP
