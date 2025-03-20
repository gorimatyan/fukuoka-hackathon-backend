#!/bin/bash

# データベースのマイグレーションを実行
echo "Running database migrations..."
npx prisma migrate deploy

# シードデータの投入（必要な場合はコメントを外してください）
# echo "Running seed data..."
# npx prisma db seed

# アプリケーションを起動
echo "Starting application..."
npm run dev