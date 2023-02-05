import axios from "axios";

require("dotenv").config();

export async function fetchTiktokVideo(
  tiktokVideoLink: string
): Promise<string | null> {
  const options = {
    method: "GET",
    url: "https://tiktok-video-no-watermark2.p.rapidapi.com/",
    params: {
      url: tiktokVideoLink,
      hd: "0",
    },
    headers: {
      "X-RapidAPI-Key": process.env["APIKey"],
      "X-RapidAPI-Host": "tiktok-video-no-watermark2.p.rapidapi.com",
    },
  };

  let tiktokCDNLink: string | null = null;

  await axios
    .request(options)
    .then((response) => {
      tiktokCDNLink = response.data.data.play;
    })
    .catch((error) => {
      console.log(error);
    });

  return tiktokCDNLink;
}
