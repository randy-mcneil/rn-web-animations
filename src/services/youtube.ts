import { zEnv } from "../zenv";

interface SearchParams {
  pageToken?: string;
  maxResults?: string;
}

const defaultQueryParams = {
  part: "snippet",
  type: "video",
  q: "programming",
  maxResults: "24",
};

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Video {
  etag: string;
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    thumbnails: {
      default: Thumbnail;
      medium: Thumbnail;
      high: Thumbnail;
    };
    channelTitle: string;
    publishTime: string;
  };
  id: {
    videoId: string;
  };
}

export interface SearchResult {
  nextPageToken?: string;
  prevPageToken?: string;
  items: Video[];
}

export const searchSnippets = async (params: SearchParams) => {
  const urlSearchParams = new URLSearchParams({
    ...defaultQueryParams,
    ...params,
    key: zEnv.REACT_APP_YOUTUBE_API_KEY,
  });
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${urlSearchParams}`
  );
  return (await response.json()) as SearchResult;
};
