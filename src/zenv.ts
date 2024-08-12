import { z } from "zod";

export const ZEnv = z.object({
  REACT_APP_YOUTUBE_API_KEY: z.string().min(1),
});

export const zEnv = ZEnv.parse({
  REACT_APP_YOUTUBE_API_KEY: process.env.REACT_APP_YOUTUBE_API_KEY,
});
