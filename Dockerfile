# ベースイメージとしてNode.js 20のスリム版を使用
# 本番環境でも最小限のイメージサイズを維持
FROM node:20-slim

# Puppeteerで必要となる依存関係をインストール
# スクレイピング機能に必要なChrome関連パッケージと
# 多言語対応のためのフォントパッケージをインストール
# セキュリティアップデートも含めて最新の状態を維持
# Puppeteer用の依存関係をインストール
RUN apt-get update \
    && apt-get install -y \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Puppeteerの設定
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# アプリケーションの作業ディレクトリを設定
# Cloud Run環境での実行ディレクトリとして/appを使用
WORKDIR /app

# パッケージ依存関係ファイルをコピー
# ビルドキャッシュを最適化するため、依存関係ファイルを先にコピー
COPY package*.json ./

# prismaディレクトリをコピー（スキーマファイルを含む）
COPY prisma ./prisma/

# 本番環境用の依存関係のみをインストール
# --productionフラグにより開発依存関係を除外し、イメージサイズを削減
# また、脆弱性のある依存関係を除外することでセキュリティも向上
RUN npm install --production

# Prismaクライアントを生成
# データベースとの型安全な通信を確保するため、
# スキーマに基づいたクライアントコードを生成
RUN npx prisma generate

# アプリケーションのソースコードをコピー
# .dockerignoreで指定された不要なファイルを除外してコピー
COPY . .

# アプリケーションポートの公開
# Cloud Runは環境変数PORTで指定されたポートにリクエストを転送
EXPOSE 3001

# 本番環境用のアプリケーション起動コマンド
# npm startで最適化されたプロダクションサーバーを起動
CMD ["npm", "start"]