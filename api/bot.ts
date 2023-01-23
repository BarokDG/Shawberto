import { Bot, webhookCallback } from "grammy";
import { fetchTiktokVideo } from "../fetch-scripts";

require("dotenv").config();

if (!process.env.BOT_TOKEN) {
  throw new Error("Environment variable 'BOT_TOKEN' not set");
}

const bot = new Bot(process.env.BOT_TOKEN);

// listen to tiktok links
bot.hears(/^https:\/\/(www|vm).tiktok.com\/.*/g, async (ctx) => {
  if (!ctx.message?.text) return;

  try {
    const videoUrl: string | null = await fetchTiktokVideo(ctx.message.text);
    if (!videoUrl) {
      await ctx.reply("Invalid url");
      return;
    }

    await ctx.replyWithVideo(videoUrl);
  } catch (err) {
    await ctx.reply("This shouldn't happen. Call Barok.");
  }
});

// To test if running
bot.hears(
  /Shawberto, you good?/,
  async (ctx) => await ctx.reply("Shawberto is running.")
);

export default webhookCallback(bot, "http");
