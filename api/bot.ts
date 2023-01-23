import { Bot, webhookCallback } from "grammy";
import { fetchTiktokVideo } from "../fetch-scripts";

require("dotenv").config();

const bot = new Bot(process.env.BOT_TOKEN as string);

// listen to tiktok links
bot.hears(/^https:\/\/(www|vm).tiktok.com\/.*/g, async (ctx) => {
  if (!ctx.message?.text) return;

  try {
    const videoUrl: string | null = await fetchTiktokVideo(ctx.message.text);
    if (!videoUrl) {
      await ctx.reply("Invalid url");
      return;
    }

    ctx.replyWithVideo(videoUrl);
  } catch (err) {
    ctx.reply("This shouldn't happen. Call Barok.");
  }
});

// To test if running
bot.hears(/Shawberto, you good?/, (ctx) => ctx.reply("Shawberto is running."));

export default webhookCallback(bot, "http");
