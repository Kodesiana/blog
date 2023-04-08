import fs from 'fs/promises';
import path from 'path';

import axios from 'axios';
import { parse } from 'yaml';
import { XMLParser } from 'fast-xml-parser';

import { DataContract, IDataProvider } from './types';
import { fileExists } from '../utils/fs-utils';
import { CACHE_DATA_TTL } from '../utils/cache';

export type YoutubeData = {
  title: string;
  url: string;
  publishedAt: Date;
  thumbnail: string;
  description: string;
};

export type YouTubeDataType = DataContract<YoutubeData>;

export class YouTubeDataProvider implements IDataProvider {
  private _dataPath: string;
  private _configPath: string;

  public name = 'Latest YouTube video upload';

  constructor() {
    this._dataPath = path.resolve(process.cwd(), './data/latest_video.json');
    this._configPath = path.resolve(process.cwd(), './config.yaml');
  }

  async shouldFetch(): Promise<boolean> {
    // check if we don't have a cached version
    if (!(await fileExists(this._dataPath))) {
      return true;
    }

    // check if cached data is stale
    const cachedData = JSON.parse(await fs.readFile(this._dataPath, 'utf-8')) as YouTubeDataType;
    if (new Date().getTime() - new Date(cachedData.lastUpdated).getTime() > CACHE_DATA_TTL) {
      return true;
    }

    // data is not cached and is stalled
    return false;
  }

  async fetch(): Promise<void> {
    // load configuration file
    const config = parse(await fs.readFile(this._configPath, 'utf-8'));

    // download latest video feed
    const { data } = await axios.get(
      'https://www.youtube.com/feeds/videos.xml?channel_id=' + config.params.youtubeChannelId
    );
    const root = new XMLParser({ ignoreAttributes: false }).parse(data);

    // parse feed
    const latestVideo = root.feed.entry[1];
    const thumbnail = latestVideo['media:group']['media:thumbnail']['@_url'] as string;
    const description = latestVideo['media:group']['media:description'] as string;

    // construct data contract
    const video: YouTubeDataType = {
      filePath: this._dataPath,
      lastUpdated: new Date(),
      data: {
        title: latestVideo.title as string,
        publishedAt: new Date(latestVideo.published),
        description: description,
        thumbnail: thumbnail,
        url: latestVideo.link['@_href'] as string,
      },
    };

    // save to file
    await fs.writeFile(this._dataPath, JSON.stringify(video, null, 2));
  }
}
