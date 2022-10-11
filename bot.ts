import { Bot } from "grammy";

const bot = new Bot("5754429343:AAF9hNIWqebeFh8r5cZeeVoYsbsdT6ox1dc");

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.on("message", (ctx) => ctx.reply("Got another message!"));

bot.start();
