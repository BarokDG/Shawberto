import axios from "axios";

import * as Sentry from "@sentry/node";

import "dotenv/config";

import type { TikTokVideoInfo } from "../types";

const { API_AUTHORIZATION_KEY } = process.env;

export async function getTiktokVideoInfo(
  videoUrl: string
): Promise<TikTokVideoInfo | undefined> {
  const options = {
    url: "https://tiktok-video-feature-summary.p.rapidapi.com/",
    params: {
      url: videoUrl,
    },
    headers: {
      "X-RapidAPI-Key": API_AUTHORIZATION_KEY,
      "X-RapidAPI-Host": "tiktok-video-feature-summary.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);
  }
}
