import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.api.setWebhook(process.env.WEBHOOK_ADDRESS as string);
