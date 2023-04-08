import dotenv from 'dotenv';
dotenv.config();

import { GithubDataProvider, YouTubeDataProvider } from './data';

(async () => {
  // create a list of data fetchers
const fetchers = [new YouTubeDataProvider(), new GithubDataProvider()];

// create download queues
const tasks = fetchers.map(async (fetcher) => {
  // check if the data needs to be fetched
  if (await fetcher.shouldFetch()) {
    console.log(`Fetching data for ${fetcher.name}...`);

    // fetch the data
    return fetcher.fetch();
  }
});

// fetch data for each fetcher
await Promise.all(tasks);

console.log('Done!');
})();
