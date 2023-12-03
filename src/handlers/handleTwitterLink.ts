import type { HearsContext, Context } from "grammy";
import { bot } from "../index";
import { getTweetInfo } from "../services";
import type { TweetInfo } from "../types";
import { truncateCaption, handleError } from "../utils";

export async function handleTwitterLink(
  ctx: HearsContext<Context>
): Promise<void> {
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
        caption: truncateCaption(tweetObject.text),
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
