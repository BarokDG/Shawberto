import type { Context } from "grammy";
import type { Message } from "grammy/types";
import * as Sentry from "@sentry/node";

import { bot } from "./index";

import { DURATION_IN_MILLI_SECONDS_TO_SHOW_ERROR_BEFORE_DELETING } from "./constants";

export function truncateCaption(caption: string): string {
  if (caption.length > 200) {
    return `${caption.substring(0, 200)}...`;
  }

  return caption;
}

export async function handleError(
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
    setTimeout(resolve, DURATION_IN_MILLI_SECONDS_TO_SHOW_ERROR_BEFORE_DELETING)
  );

  await bot.api.deleteMessage(ctx.chat?.id as number, loader.message_id);
}
