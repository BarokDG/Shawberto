import type { Context, NextFunction, Transformer } from "grammy";

// Use telegram's reply to message feature for all messages. See https://telegram.org/blog/replies-mentions-hashtags?setln=en#replies
export function replyToMessageTransformer(ctx: Context): Transformer {
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
export async function replyToMessageMiddleWare(
  ctx: Context,
  next: NextFunction
): Promise<void> {
  ctx.api.config.use(replyToMessageTransformer(ctx));
  await next();
}
