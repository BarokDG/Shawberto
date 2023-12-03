import { webhookCallback } from "grammy";
import { autoRetry } from "@grammyjs/auto-retry";
import "dotenv/config";

import { bot } from "../src/index";

import {
  TIKTOK_LINK_REGEX,
  TWITTER_LINK_REGEX,
  INSTAGRAM_REEL_LINK_REGEX,
  SHAWBERTO_REGEX,
  DEVBERTO_REGEX,
} from "../src/constants";
import { replyToMessageMiddleWare } from "../src/middleware/replyToMessage";
import {
  handleTiktokLink,
  handleInstagramReelLink,
  handleTwitterLink,
} from "../src/handlers";

const { ENV, VERCEL_ENV } = process.env;
const isDevelopment = ENV === "development";

bot.api.config.use(
  autoRetry({
    maxRetryAttempts: 1,
    maxDelaySeconds: 10,
  })
);
bot.use(replyToMessageMiddleWare);

bot.command(
  "start",
  async (ctx) => await ctx.reply("Welcome! Up and running.")
);

bot.on("::url").hears(TIKTOK_LINK_REGEX, handleTiktokLink);
bot.on("::url").hears(TWITTER_LINK_REGEX, handleTwitterLink);
bot.on("::url").hears(INSTAGRAM_REEL_LINK_REGEX, handleInstagramReelLink);

bot
  .on(":text")
  .hears(
    isDevelopment || VERCEL_ENV === "preview"
      ? DEVBERTO_REGEX
      : SHAWBERTO_REGEX,
    async (ctx) => await ctx.reply(`${ctx.me.first_name} is running`)
  );

if (isDevelopment) {
  void bot.start({
    drop_pending_updates: true,
  });
}

export default webhookCallback(bot, "next-js");
