import axios from "axios";

import * as Sentry from "@sentry/node";

import "dotenv/config";

import type { TweetInfo } from "../types";

const { API_AUTHORIZATION_KEY } = process.env;

export async function getTweetInfo(
  tweetUrl: string
): Promise<TweetInfo | undefined> {
  const id = extractTweetID(tweetUrl);

  if (!id) {
    return undefined;
  }

  const options = {
    method: "GET",
    url: "https://twitter154.p.rapidapi.com/tweet/details",
    params: {
      tweet_id: id,
    },
    headers: {
      "X-RapidAPI-Key": API_AUTHORIZATION_KEY,
      "X-RapidAPI-Host": "twitter154.p.rapidapi.com",
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

function extractTweetID(url: string): string | null {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : null;
}
