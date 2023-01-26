import { Bot } from "grammy";

require("dotenv").config();

let WEBHOOK_ADDRESS: string = (process.env.ENV = "debug"
  ? (process.env.NGROK_WEBHOOK_ADDRESS as string)
  : (process.env.WEBHOOK_ADDRESS as string));

const bot = new Bot(process.env.BOT_TOKEN as string);

(async function () {
  try {
    await bot.api.setWebhook(WEBHOOK_ADDRESS, {
      allowed_updates: ["message"],
    });

    console.log("Webhook set!");
  } catch (err) {
    console.log(err);
  }
})();
