import axios from "axios";

require("dotenv").config();

if (!process.env.BOT_TOKEN)
  throw new Error("Environment variable 'BOT_TOKEN' is not set.");

if (!process.env.WEBHOOK_ADDRESS)
  throw new Error("Environemnt variable 'WEBHOOK_ADDRESS' not set");

(async function () {
  let isWebhookSet = false;

  let res = await axios.request({
    method: "GET",
    url: `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getWebhookInfo`,
  });

  isWebhookSet = res.data.result.url === process.env.WEBHOOK_ADDRESS;

  if (isWebhookSet) return;

  axios
    .request({
      method: "POST",
      url: `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook`,
      params: {
        url: process.env.WEBHOOK_ADDRESS,
      },
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
})();
