import { Bot } from "grammy";
import axios from "axios";

function main() {
  if (!process.env.BOT_TOKEN) return;

  const bot = new Bot(process.env.BOT_TOKEN);

  // listen to tiktok links
  bot.hears(/^https:\/\/www.tiktok.com\/.*/g, (ctx) => {
    if (!ctx.message?.text) return;

    try {
      fetchTiktokVideo(ctx.message.text).then((videoUrl: string | null) => {
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

  // To test if running
  bot.hears(/Shawberto, you good?/, (ctx) =>
    ctx.reply("Shawberto is running.")
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
}

main();
