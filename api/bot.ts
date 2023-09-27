import {
  type Context,
  type NextFunction,
  type Transformer,
  Bot,
  webhookCallback,
} from "grammy";
import { autoRetry } from "@grammyjs/auto-retry";
import * as Sentry from "@sentry/node";
import "dotenv/config";

import { getTiktokVideoInfo, getTweetInfo } from "../src/services";
import type { TikTokVideoInfo, TweetInfo } from "../src/types";

const { BOT_TOKEN, ENV, SENTRY_DSN } = process.env;

Sentry.init({
  dsn: SENTRY_DSN,
});

const isDevelopment = ENV === "development";

const TIKTOK_LINK_REGEX = /^https:\/\/(www|vm|vt).tiktok.com\/.*/g;
const TWITTER_LINK_REGEX = /^https:\/\/(www\.)?(twitter|x).com\/.*/g;
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
    const videoUrl: TikTokVideoInfo | undefined = await getTiktokVideoInfo(
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

    await ctx.replyWithVideo(videoUrl.data.play, {
      caption: videoUrl.data.title,
    });

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

// Handle Twitter links
bot.on("::url").hears(TWITTER_LINK_REGEX, async (ctx) => {
  if (!ctx.message?.text) return;

  const loader = await ctx.reply("Processing link...");

  try {
    const tweetObject: TweetInfo | undefined = await getTweetInfo(
      ctx.message.text
    );

    if (!tweetObject) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw tweetObject;
    }

    console.log(JSON.stringify(tweetObject, null, 2));

    let mediaUrl: string | undefined;
    let replyWith: "video" | undefined;

    if (
      tweetObject.extended_entities.media[0].type === "video" ||
      tweetObject.extended_entities.media[0].type === "animated_gif"
    ) {
      mediaUrl =
        tweetObject.extended_entities.media[0].video_info.variants.find(
          (variant) => variant.content_type === "video/mp4"
        )?.url;

      replyWith = "video";
    }

    console.log(mediaUrl);

    if (mediaUrl) {
      await bot.api.editMessageText(
        ctx.chat.id,
        loader.message_id,
        `Sending ${replyWith}...`
      );

      await ctx.replyWithVideo(mediaUrl, {
        caption: tweetObject.text,
      });
    }

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
  void bot.start({
    drop_pending_updates: true,
  });
}

export default webhookCallback(bot, "next-js");

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
