import { Bot, webhookCallback } from "grammy";
import axios from "axios";

if (!process.env.BOT_TOKEN) {
  throw Error("Environment variable 'BOT_TOKEN' not set");
}

const bot = new Bot(process.env.BOT_TOKEN);

// listen to tiktok links
bot.hears(/^https:\/\/(www|vm).tiktok.com\/.*/g, async (ctx) => {
  if (!ctx.message?.text) return;

  try {
    const videoUrl: string | null = await fetchTiktokVideo(ctx.message.text);
    if (!videoUrl) {
      await ctx.reply("Invalid url");
      return;
    }

    await ctx.replyWithVideo(videoUrl);
  } catch (err) {
    await ctx.reply("This shouldn't happen. Call Barok.");
  }
});

// To test if running
bot.hears(
  /Shawberto, you good?/,
  async (ctx) => await ctx.reply("Shawberto is running.")
);

bot.start();

async function fetchTiktokVideo(link: string | null): Promise<string | null> {
  const options = {
    method: "GET",
    url: "https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/vid/index",
    params: {
      url: link,
    },
    headers: {
      "X-RapidAPI-Key": "11a08a8211msh8578bdf05a9ed95p11e117jsnd72bdf0d38fe",
      "X-RapidAPI-Host":
        "tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com",
    },
  };

  let tiktokCDNLink: string | null = null;

  await axios
    .request(options)
    .then(function (response: { data: any }) {
      tiktokCDNLink = response.data.video[0];
    })
    .catch(function (error: any) {
      console.error(error);
    });

  return tiktokCDNLink;
}

export default webhookCallback(bot, "http");
