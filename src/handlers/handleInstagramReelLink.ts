import type { HearsContext, Context } from "grammy";
import { bot } from "../index";
import { getInstagramPostInfo } from "../services";
import type { InstagramPostInfoResponse } from "../types";
import { truncateCaption, handleError } from "../utils";

export async function handleInstagramReelLink(
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
      caption: truncateCaption(postInfo.data.caption.text),
    });

    await bot.api.deleteMessage(ctx.chat.id, loader.message_id);
  } catch (error) {
    await handleError(error, ctx, loader);
  }
}
