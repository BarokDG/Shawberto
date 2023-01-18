import { Bot } from "grammy";
import axios from "axios";

const bot = new Bot("5898666265:AAHCrh13937amAcJiq_B8qRpCi_TBMZesNo");

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.hears(/^https:\/\/www.tiktok.com\/.*/g, (ctx) => {
  if (!ctx.message?.text) return;

  try {
    fetchVideo(ctx.message.text).then((videoUrl: string | null) => {
      if (!videoUrl) {
        ctx.reply("Invalid url");
        return;
      }

      ctx.replyWithVideo(videoUrl);
    });
  } catch (err) {
    ctx.reply("This shouldn't happen. Call Barok.");
  }
});

bot.start();

async function fetchVideo(link: string | null) {
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

  let tiktokCDNLink = null;

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
