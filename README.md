# 漢のハッカソン Project

## プロジェクト概要
このプロジェクトは、リアルタイム情報をマップ上に表示する機能を持ちます。

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

## Prisuma実行
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

## ディレクトリ構成
```
/backend
├── prisma
│   ├── schema.prisma　テーブル定義
│   ├── seed.ts //テストデータ
├── src
│   ├── models　//タイプスクリプトの型を定義
│   │   ├── CommonResponseModel.ts　
│   ├── middlewares　
│   │   ├── emailReceiver.ts
│   ├── server.ts
│   ├── app.ts
├── .env
├── package.json
└── README.md
```


## xのAPIリファレンス
https://docs.x.com/x-api/posts/full-archive-search


## OpenStreetMap
src/middlewares/geocoding.ts
町目までしか検索できない。

## google
以下を設定
GOOGLE_MAPS_API_KEY=

# 外部API
GoogleMapsAPI
GeminiAPI
XAPI
GNEWSAPI
IMAP
