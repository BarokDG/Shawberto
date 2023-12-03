import { Bot } from "grammy";
import * as Sentry from "@sentry/node";

import "dotenv/config";

const { BOT_TOKEN, ENV, SENTRY_DSN } = process.env;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is unset");

const isDevelopment = ENV === "development";

if (!isDevelopment) {
  Sentry.init({
    dsn: SENTRY_DSN,
  });
}

export const bot = new Bot(BOT_TOKEN);
