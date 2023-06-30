import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import axios from 'axios';
import { uniq } from 'lodash-es';
import { Semaphore } from 'async-mutex';

import { fileExists } from './fs.mjs';

// concurrency limit
const semaphore = new Semaphore(5);

// cache directory
const ROOT_DIR = path.resolve(fileURLToPath(import.meta.url), '..', '..', '..');
const CACHE_DIR = path.resolve(ROOT_DIR, '.cache/icons');

// watch glob
export const SVG_GLOBS = [path.join(CACHE_DIR, '**/*.svg')];
export const WATCH_GLOBS = ['./content/**/*.md', './layouts/**/*.html', './*.yml'];

// available icon packs
const ICON_PACKS = {
  'bi': 'https://raw.githubusercontent.com/twbs/icons/main/icons',
  'logos': 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos',
  'tabler': 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons',
  'skill-icons': 'https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons',
  'simple-icons': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons',
};

async function download(pack, name, outputPath) {
  try {
    // build url
    const url = `${ICON_PACKS[pack]}/${name}.svg`;

    // download the icon
    const { data } = await axios.get(url);

    // remove first line and remove empty lines
    const lines = data.split('\n');
    if (lines[0].startsWith('<?xml')) lines.shift();
    const filtered = lines.filter((line) => line.trim().length > 0).join('\n');

    // write to cache
    await fs.writeFile(outputPath, filtered, { flag: 'w' });

    return true;
  } catch (error) {
    // icon is not found
    if (error instanceof axios.AxiosError && error.response?.status === 404) {
      console.error(`Icon "${name}" does not exist in pack "${pack}"`);
    }

    console.error(error.message);
    return false;
  }
}

async function processIcon(name) {
  // split pack and icon name
  const [pack, icon] = name.split(':');

  // check if pack exists
  if (pack in ICON_PACKS === false) {
    console.error(`Icon pack "${pack}" does not exist`);
    return FALLBACK_ICON;
  }

  // check cache
  const cachePath = path.resolve(CACHE_DIR, `${pack}/${icon}.svg`);
  const cacheExists = await fileExists(cachePath);

  // cache not available, download it
  if (!cacheExists) {
    console.log(`Downloading '${name}'...`);

    // download the icon
    await download(pack, icon, cachePath);
  }
}

export async function makeDirs() {
  // create the cache dir
  for (const pack of Object.keys(ICON_PACKS)) {
    await fs.mkdir(path.join(CACHE_DIR, pack), { recursive: true });
  }
}

export async function handleFile(fileName, echo) {
  // echo if needed
  if (echo) {
    console.log(`Processing ${fileName}...`);
  }

  // read the file
  const contents = await fs.readFile(fileName, 'utf-8');

  // create matcher
  const iconPacks = Object.keys(ICON_PACKS).join('|');
  const pattern1 = new RegExp(`"(${iconPacks}):(.+?)"`, 'gm');
  const pattern2 = new RegExp(`(${iconPacks}):(.+)`, 'gm');
  const pattern3 = new RegExp(`(${iconPacks}):(.+?)"`, 'gm');

  const allMatches = [
    ...[...contents.matchAll(pattern1)].map((match) => match[0].substring(1, match[0].length - 1)),
    ...[...contents.matchAll(pattern2)].map((match) => match[0]),
    ...[...contents.matchAll(pattern3)].map((match) => match[0].substring(0, match[0].length - 1)),
  ].filter((match) => !match.includes('class') && !match.includes('}}') && !match.includes('"'));

  // match all icons
  const tasks = uniq(allMatches).map((icon) => semaphore.runExclusive(() => processIcon(icon)));
  await Promise.all(tasks);
}
