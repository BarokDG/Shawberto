import {
  type Context,
  type NextFunction,
  type Transformer,
  Bot,
  webhookCallback,
} from "grammy";
import { autoRetry } from "@grammyjs/auto-retry";
import * as Sentry from "@sentry/node";
import axios from "axios";
import "dotenv/config";

import type { VideoInfo } from "../src/types";

Sentry.init({
  dsn: "https://c0615c97fc2fdcb6bdf33bc3735859d0@o4505930555260928.ingest.sentry.io/4505930736992256",
});

const { BOT_TOKEN, API_AUTHORIZATION_KEY, ENV } = process.env;

const isDevelopment = ENV === "development";

const TIKTOK_LINK_REGEX = /^https:\/\/(www|vm|vt).tiktok.com\/.*/g;
const SHAWBERTO_REGEX = /Shawberto, you good?/g;
const DEVBERTO_REGEX = /Devberto, you good?/g;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(BOT_TOKEN);

bot.api.config.use(autoRetry());
bot.use(replyToMessageMiddleWare);

bot.command(
  "start",
  async (ctx) => await ctx.reply("Welcome! Up and running.")
);

// Handle TikTok links
bot.on("::url").hears(TIKTOK_LINK_REGEX, async (ctx) => {
  if (!ctx.message?.text) return;

  const loader = await ctx.reply("Processing link...");

  try {
    const videoUrl: VideoInfo | undefined = await getTiktokVideoInfo(
      ctx.message.text
    );

    if (!videoUrl || videoUrl.code === -1) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw videoUrl;
    }

    await bot.api.editMessageText(
      ctx.chat.id,
      loader.message_id,
      "Sending video..."
    );

    await ctx.replyWithVideo(videoUrl.data.play);

    await bot.api.deleteMessage(ctx.chat.id, loader.message_id);
  } catch (error) {
    Sentry.captureException(error);

    await bot.api.editMessageText(
      ctx.chat.id,
      loader.message_id,
      "Error processing link"
    );

    const timer = setTimeout(() => {
      void bot.api.deleteMessage(ctx.chat.id, loader.message_id);
      clearTimeout(timer);
    }, 1000);
  }
});

// Test if bot is running
bot
  .on(":text")
  .hears(
    isDevelopment ? DEVBERTO_REGEX : SHAWBERTO_REGEX,
    async (ctx) => await ctx.reply(`${ctx.me.first_name} is running`)
  );

if (isDevelopment) {
  void bot.start();
}

export default webhookCallback(bot);

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
    Sentry.captureException(error);
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
