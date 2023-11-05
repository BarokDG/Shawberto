import axios from "axios";

import * as Sentry from "@sentry/node";

import "dotenv/config";

import type { InstagramPostInfoResponse } from "../types";

const { API_AUTHORIZATION_KEY } = process.env;

export async function getInstagramPostInfo(
  instaReelUrl: string
): Promise<InstagramPostInfoResponse | undefined> {
  const shortCode = extractShortCode(instaReelUrl);

  if (!shortCode) {
    return;
  }

  const options = {
    method: "GET",
    url: `https://instagram243.p.rapidapi.com/postdetail/${shortCode}`,
    headers: {
      "X-RapidAPI-Key": API_AUTHORIZATION_KEY,
      "X-RapidAPI-Host": "instagram243.p.rapidapi.com",
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

function extractShortCode(url: string): string | null {
  const match = url.match(/reel\/(\w+)/);
  return match ? match[1] : null;
}
