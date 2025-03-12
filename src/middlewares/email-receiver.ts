import Imap from "imap";
import { simpleParser } from "mailparser";
import { prisma } from "../config/prisma";
import IMAP_CONFIG from "../config/imap";
import { geocodeAddressWithGoogle } from "./google-geocoding";





const imap = new Imap(IMAP_CONFIG);

function openInbox(callback: (err: Error | null, box?: any) => void) {
  imap.openBox("INBOX", false, callback);
}

export function startEmailListener() {
  imap.once("ready", () => {
    console.log("📧 IMAP接続成功 - メール監視開始");

    openInbox((err) => {
      if (err) throw err;

      imap.on("mail", () => {
        console.log("📩 新着メールを検出 - 解析開始");
        fetchEmails();
      });

      fetchEmails();
    });
  });

  imap.once("error", (err: Error) => {
    console.error("❌ IMAP エラー:", err);
  });

  imap.once("end", () => {
    console.log("🔌 IMAP 接続が終了しました");
  });

  imap.connect();
}

async function fetchEmails() {
  const senderEmail = "fukushosaigai@m119.city.fukuoka.lg.jp"; // 福岡消防のメールのみ対象

  imap.search(["UNSEEN", ["FROM", senderEmail]], (err, results) => {
    if (err) {
      console.error("❌ メール検索エラー:", err);
      return;
    }
    
    if (results.length === 0) {
      console.log("📭 新着メールなし");
      return;
    }

    const fetch = imap.fetch(results, { bodies: "", markSeen: true });

    fetch.on("message", (msg, seqno) => {
      console.log(`📩 メール #${seqno} を処理中...`);
      let emailBody = "";

      msg.on("body", (stream) => {
        stream.on("data", (chunk) => {
          emailBody += chunk.toString();
        });
      });

      msg.once("end", async () => {
        try {
          const parsed = await simpleParser(emailBody);
          console.log("📜 メール受信:", parsed.subject, parsed.from?.text);

          const disasterType = parseDisasterType(parsed.text || ""); // 災害の種別を抽出
          const firstLine = parseFirstLine(parsed.text || ""); // 最初の一行目を抽出
          const address = parseAddress(parsed.text || ""); // 住所を抽出
          const coordinates = await geocodeAddressWithGoogle(simplifyAddress(address));
          // DBに保存
          await prisma.email.create({
            data: {
              from: parsed.from?.text || "unknown",
              subject: parsed.subject || "No Subject",
              body: firstLine, // 最初の一行目を保存
              disasterType, // 種別を保存
              address, // 住所を保存
              receivedAt: new Date(),// 受信日時を記録
              latitude: coordinates?.latitude || null,
              longitude: coordinates?.longitude || null,
              createdAt: new Date(), // 作成日時を記録
            },
          });

          console.log(`✅ メールをDBに保存しました（種別: ${disasterType}, 住所: ${address}）`);
        } catch (error) {
          console.error("❌ メール解析エラー:", error);
        }
      });
    });

    fetch.once("end", () => {
      console.log("✅ すべての未読メールを処理しました");
    });
  });
}

/**
 * メール本文から災害の種別（救急・火災・救助など）を抽出する
 */
function parseDisasterType(message: string): string {
  const disasterTypes = ["救急", "火災", "救助", "災害", "警戒"]; // 必要に応じて追加
  
  for (const type of disasterTypes) {
    if (message.includes(type)) {
      return type; // 一番最初に見つかった種別を返す
    }
  }

  return "不明"; // 該当しない場合
}

/**
 * メール本文から最初の一行目を抽出する
 */
function parseFirstLine(message: string): string {
  const lines = message.split("\n");
  return lines[0].trim(); // 最初の一行目を返す
}

/**
 * メール本文から住所を抽出する
 */
function parseAddress(message: string): string {
  const addressPattern = /(\S+区\s+\S+?(\d+丁目(\d+番)?)?付近?)/;
  const match = message.match(addressPattern);
  return match ? match[0] : "住所不明";
}

/**
 * 住所から緯度経度を取得できるように整形する
 * @param address 
 * @returns 
 */
function simplifyAddress(address: string): string {
  const matched = address.match(/^.+\d+丁目/);
  return matched ? matched[0] : address;
}