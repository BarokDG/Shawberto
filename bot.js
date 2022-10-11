"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const bot = new grammy_1.Bot("5754429343:AAF9hNIWqebeFh8r5cZeeVoYsbsdT6ox1dc");
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.on("message::url", (ctx) => ctx.reply("uuu arr elll"));
// bot.on("message", (ctx) => ctx.reply("Got another message!"));
bot.on("message:text", (ctx) => ctx.reply("here too"));
bot.start();
