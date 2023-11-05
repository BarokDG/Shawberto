import {
  type Context,
  type HearsContext,
  type NextFunction,
  type Transformer,
  Bot,
  webhookCallback,
} from "grammy";
import type { Message } from "grammy/types";
import { autoRetry } from "@grammyjs/auto-retry";
import * as Sentry from "@sentry/node";
import "dotenv/config";

import {
  getTiktokVideoInfo,
  getTweetInfo,
  getInstagramPostInfo,
} from "../src/services";
import type {
  InstagramPostInfoResponse,
  TikTokVideoInfo,
  TweetInfo,
} from "../src/types";
import {
  TIKTOK_LINK_REGEX,
  TWITTER_LINK_REGEX,
  INSTAGRAM_REEL_LINK_REGEX,
  SHAWBERTO_REGEX,
  DEVBERTO_REGEX,
  SECONDS_TO_SHOW_ERROR_BEFORE_DELETING,
} from "../src/constants";

const { BOT_TOKEN, ENV, SENTRY_DSN, VERCEL_ENV } = process.env;

const isDevelopment = ENV === "development";

if (!isDevelopment) {
  Sentry.init({
    dsn: SENTRY_DSN,
  });
}

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(BOT_TOKEN);

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

bot.on("::url").hears(TIKTOK_LINK_REGEX, handleTikTokLink);
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

async function handleTikTokLink(ctx: HearsContext<Context>): Promise<void> {
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
    await handleError(error, ctx, loader);
  }
}

async function handleTwitterLink(ctx: HearsContext<Context>): Promise<void> {
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

    let mediaUrl: string | undefined;

    if (
      tweetObject.extended_entities?.media?.[0]?.type === "video" ||
      tweetObject.extended_entities?.media?.[0]?.type === "animated_gif"
    ) {
      mediaUrl =
        tweetObject.extended_entities.media[0].video_info.variants.find(
          (variant) => variant.content_type === "video/mp4"
        )?.url;
    }

    if (mediaUrl) {
      await bot.api.editMessageText(
        ctx.chat.id,
        loader.message_id,
        `Sending video...`
      );

      await ctx.replyWithVideo(mediaUrl, {
        caption: tweetObject.text,
      });
    } else {
      await bot.api.editMessageText(
        ctx.chat.id,
        loader.message_id,
        "Nothing to send"
      );
    }

    await bot.api.deleteMessage(ctx.chat.id, loader.message_id);
  } catch (error) {
    await handleError(error, ctx, loader);
  }
}

async function handleInstagramReelLink(
  ctx: HearsContext<Context>
): Promise<void> {
  if (!ctx.message?.text) return;

  const loader = await ctx.reply("Processing link...");

  try {
    const postInfo: InstagramPostInfoResponse | undefined =
      await getInstagramPostInfo(ctx.message.text);

    if (!postInfo || postInfo.status === "fail") {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw postInfo;
    }

    await bot.api.editMessageText(
      ctx.chat.id,
      loader.message_id,
      "Sending video..."
    );

    await ctx.replyWithVideo(postInfo.data.video_versions[0].url, {
      caption: postInfo.data.caption.text,
    });

    await bot.api.deleteMessage(ctx.chat.id, loader.message_id);
  } catch (error) {
    await handleError(error, ctx, loader);
  }
}

async function handleError(
  error: unknown,
  ctx: Context,
  loader: Message
): Promise<void> {
  Sentry.captureException(error);

  await bot.api.editMessageText(
    ctx.chat?.id as number,
    loader.message_id,
    "Error processing link"
  );

  await new Promise((resolve) =>
    setTimeout(resolve, SECONDS_TO_SHOW_ERROR_BEFORE_DELETING)
  );

  await bot.api.deleteMessage(ctx.chat?.id as number, loader.message_id);
}
