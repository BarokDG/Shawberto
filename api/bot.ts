import { Bot, webhookCallback } from "grammy";
import { fetchTiktokVideo } from "../fetch-scripts";

require("dotenv").config();

/**
 * * TEST_BOT_TOKEN is for a different bot to develop new features without stopping the main bot
 * * ONLY to be used in development
 * */
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
      await ctx.reply(
        "Invalid url or bot request limit reached(will fix this soon)",
        {
          reply_to_message_id:
            ctx.chat.type === "private" ? undefined : ctx.msg.message_id,
        }
      );
      return;
    }

    await ctx
      .replyWithVideo(videoUrl, {
        reply_to_message_id:
          ctx.chat.type === "private" ? undefined : ctx.msg.message_id,
      })
      .catch(
        async () =>
          await ctx.reply("Video size not allowed by telegram", {
            reply_to_message_id:
              ctx.chat.type === "private" ? undefined : ctx.msg.message_id,
          })
      );
  } catch (err) {
    await ctx.reply("This shouldn't happen. Call Barok.", {
      reply_to_message_id:
        ctx.chat.type === "private" ? undefined : ctx.msg.message_id,
    });
  }
});

// To test if running
bot.hears(
  /Shawberto, you good?/,
  async (ctx) =>
    await ctx.reply("Shawberto is running.", {
      reply_to_message_id:
        ctx.chat.type === "private" ? undefined : ctx.msg.message_id,
    })
);

// Use long-polling with a different BOT_TOKEN in development
if (process.env.ENV === "development") {
  bot.start();
}

// Handler for webhook updates in production
export default webhookCallback(bot, "http");
