import { Bot, webhookCallback } from "grammy";
import { fetchTiktokVideo } from "../fetch-scripts";

require("dotenv").config();

const BOT_TOKEN: string =
  process.env.ENV === "development"
    ? (process.env.TEST_BOT_TOKEN as string)
    : (process.env.BOT_TOKEN as string);

const bot = new Bot(BOT_TOKEN);

// listen to tiktok links
bot.hears(/^https:\/\/(www|vm).tiktok.com\/.*/g, async (ctx) => {
  if (!ctx.message?.text) return;

  try {
    const videoUrl: string | null = await fetchTiktokVideo(ctx.message.text);
    if (!videoUrl) {
      ctx.reply("Invalid url");
      return;
    }

    await ctx
      .replyWithVideo(videoUrl)
      .catch(async () => await ctx.reply("Video size not allowed by telegram"));
  } catch (err) {
    await ctx.reply("This shouldn't happen. Call Barok.");
  }
});

// To test if running
bot.hears(
  /Shawberto, you good?/,
  async (ctx) => await ctx.reply("Shawberto is running.")
);

// Use long-polling with a different BOT_TOKEN in development
if (process.env.ENV === "development") {
  bot.start();
}

// Handler for webhook updates in production
export default webhookCallback(bot, "http");
