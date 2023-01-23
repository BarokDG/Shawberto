import axios from "axios";

export async function fetchTiktokVideo(
  tiktokVideoLink: string
): Promise<string | null> {
  const options = {
    method: "GET",
    url: "https://tiktok-downloader-download-videos-without-watermark1.p.rapidapi.com/media-info/",
    params: {
      link: tiktokVideoLink,
    },
    headers: {
      "X-RapidAPI-Key": "11a08a8211msh8578bdf05a9ed95p11e117jsnd72bdf0d38fe",
      "X-RapidAPI-Host":
        "tiktok-downloader-download-videos-without-watermark1.p.rapidapi.com",
    },
  };

  let tiktokCDNLink: string | null = null;

  await axios
    .request(options)
    .then(function (response) {
      tiktokCDNLink = response.data.result.video.url_list[0];
    })
    .catch(function (error: any) {
      console.log(error);
    });

  return tiktokCDNLink;
}
