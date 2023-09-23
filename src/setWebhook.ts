import { Bot } from "grammy";

import "dotenv/config";

const { BOT_TOKEN, WEB_HOOK } = process.env;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is unset");
if (!WEB_HOOK) throw new Error("WEB_HOOK is unset");

const bot = new Bot(BOT_TOKEN);

void (async function () {
  try {
    await bot.api.setWebhook(WEB_HOOK, {
      allowed_updates: ["edited_message", "message"],
      drop_pending_updates: true,
    });

    console.log("Webhook set!");
  } catch (err) {
    console.error(err);
  }
})();
