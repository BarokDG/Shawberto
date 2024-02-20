import type { HearsContext, Context } from "grammy";
import { bot } from "../index";
import { getTiktokVideoInfo } from "../services";
import type { TikTokVideoInfo } from "../types";
import { truncateCaption, handleError } from "../utils";
import { TIKTOK_LINK_REGEX } from "../constants";

export async function handleTiktokLink(
  ctx: HearsContext<Context>
): Promise<void> {
  if (!ctx.message?.text) return;

  const loader = await ctx.reply("Processing link...");

  try {
    const url = ctx.message.text.match(TIKTOK_LINK_REGEX)?.[0];

    if (!url) {
      throw new Error("Invalid TikTok link");
    }

    const videoUrl: TikTokVideoInfo | undefined = await getTiktokVideoInfo(url);

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
      caption: truncateCaption(videoUrl.data.title),
    });

    await bot.api.deleteMessage(ctx.chat.id, loader.message_id);
  } catch (error) {
    await handleError(error, ctx, loader);
  }
}
