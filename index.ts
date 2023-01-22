import { Bot } from "grammy";

require("dotenv").config();

if (!process.env.BOT_TOKEN)
  throw new Error("Environment variable 'BOT_TOKEN' is not set.");

if (!process.env.WEBHOOK_ADDRESS)
  throw new Error("Environemnt variable 'WEBHOOK_ADDRESS' not set");

const bot = new Bot(process.env.BOT_TOKEN);

bot.api.setWebhook(process.env.WEBHOOK_ADDRESS);
