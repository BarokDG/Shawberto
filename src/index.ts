import { Bot } from "grammy";
import * as Sentry from "@sentry/node";
import { autoRetry } from "@grammyjs/auto-retry";

import "dotenv/config";

import { replyToMessageMiddleWare } from "../src/middleware/replyToMessage";

const { BOT_TOKEN, ENV, SENTRY_DSN } = process.env;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is unset");

const isDevelopment = ENV === "development";

if (!isDevelopment) {
  Sentry.init({
    dsn: SENTRY_DSN,
  });
}

export const bot = new Bot(BOT_TOKEN);

bot.api.config.use(
  autoRetry({
    maxRetryAttempts: 1,
    maxDelaySeconds: 10,
  })
);

bot.use(replyToMessageMiddleWare);
