import { Bot } from "grammy";
import axios from "axios";
import "dotenv/config";
import type { VideoInfo } from "./types";

const { BOT_TOKEN, API_AUTHORIZATION_KEY } = process.env;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(BOT_TOKEN);

bot.command(
  "start",
  async (ctx) => await ctx.reply("Welcome! Up and running.")
);
bot.hears(/^https:\/\/(www|vm|vt).tiktok.com\/.*/g, async (ctx) => {
  if (!ctx.message?.text) return;

  try {
    const videoUrl: VideoInfo | undefined = await getTiktokVideoInfo(
      ctx.message.text
    );

    if (!videoUrl) {
      throw new Error("Video not found");
    }

    await ctx.replyWithVideo(videoUrl.data.play, {
      reply_to_message_id:
        ctx.chat.type === "private" ? undefined : ctx.msg.message_id,
    });
  } catch (error) {
    console.error(error);
  }
});
bot.hears(
  /Shawberto, you good?/,
  async (ctx) =>
    await ctx.reply("Shawberto is running.", {
      reply_to_message_id:
        ctx.chat.type === "private" ? undefined : ctx.msg.message_id,
    })
);

void bot.start();

async function getTiktokVideoInfo(
  videoUrl: string
): Promise<VideoInfo | undefined> {
  const options = {
    url: "https://tiktok-video-feature-summary.p.rapidapi.com/",
    params: {
      url: videoUrl,
    },
    headers: {
      "X-RapidAPI-Key": API_AUTHORIZATION_KEY,
      "X-RapidAPI-Host": "tiktok-video-feature-summary.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
