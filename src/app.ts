import "reflect-metadata";
import express from "express";
import { Container } from "typedi";
import { useExpressServer, useContainer as routingUseContainer } from "routing-controllers";
import { prisma } from "./config/prisma";
import env from "./config/env";
import { processGoutouNews, processJikoNews, processSatujinNews } from "./util/news-cron"; // ここで news-cron.ts から関数をインポート


const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors()); 

// TypeDIとrouting-controllersの連携設定
routingUseContainer(Container);

// TypeDIとrouting-controllersの連携
useExpressServer(app, {
    routePrefix: env.API_PREFIX || "/api",
    controllers: [__dirname + "/controllers/*.ts"],
});

// Prismaクライアントの終了処理
app.get("/health", async (req, res) => {
  const now = await prisma.$queryRaw`SELECT NOW()`;
  res.json({ status: "ok", serverTime: now });
});

// // アプリケーションの起動時にニュースを処理
// processGoutouNews().catch(error => {
//   console.error("❌ 初回ニュースGoutou処理中にエラー発生:", error);
// });
// processJikoNews().catch(error => {
//   console.error("❌ 初回ニュースJiko処理中にエラー発生:", error);
// });
// processSatujinNews().catch(error => {
//   console.error("❌ 初回ニュースSatujin処理中にエラー発生:", error);
// });
export default app;