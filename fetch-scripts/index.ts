import axios from "axios";

export async function fetchTiktokVideo(
  link: string | null
): Promise<string | null> {
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
      console.log(error);
    });

  return tiktokCDNLink;
}
