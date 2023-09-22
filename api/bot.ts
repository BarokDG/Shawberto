import { type Context, type NextFunction, type Transformer, Bot } from "grammy";
import axios from "axios";
import "dotenv/config";
import type { VideoInfo } from "./types";

const TIKTOK_LINK_REGEX = /^https:\/\/(www|vm|vt).tiktok.com\/.*/g;

const { BOT_TOKEN, API_AUTHORIZATION_KEY } = process.env;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(BOT_TOKEN);

bot.use(replyToMessageMiddleWare);

bot.command(
  "start",
  async (ctx) => await ctx.reply("Welcome! Up and running.")
);

// Handle TikTok links
bot.on("::url").hears(TIKTOK_LINK_REGEX, async (ctx) => {
  if (!ctx.message?.text) return;

  try {
    const videoUrl: VideoInfo | undefined = await getTiktokVideoInfo(
      ctx.message.text
    );

    if (!videoUrl) {
      await ctx.reply("Video not found.");
      throw new Error("Video not found");
    }

    await ctx.replyWithVideo(videoUrl.data.play);
  } catch (error) {
    console.error(error);
  }
});

// Test if bot is running
bot
  .on(":text")
  .hears(
    "Shawberto, you good?",
    async (ctx) => await ctx.reply("Shawberto is running")
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

// Use telegram's reply to message feature for all messages. See https://telegram.org/blog/replies-mentions-hashtags?setln=en#replies
function replyToMessageTransformer(ctx: Context): Transformer {
  const transformer: Transformer = async (prev, method, payload, signal) => {
    if (!method.startsWith("send")) {
      return await prev(method, payload, signal);
    }

    if (ctx.chat?.type === "private") {
      return await prev(method, payload, signal);
    }

    return await prev(
      method,
      { ...payload, reply_to_message_id: ctx.message?.message_id },
      signal
    );
  };

  return transformer;
}

// Need middleware to provide context to the transformer
async function replyToMessageMiddleWare(
  ctx: Context,
  next: NextFunction
): Promise<void> {
  ctx.api.config.use(replyToMessageTransformer(ctx));
  await next();
}
