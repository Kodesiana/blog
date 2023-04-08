import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import { uniq } from 'lodash-es';
import axios, { AxiosError } from 'axios';

import { fileExists } from './fs-utils';
import { optimizeSvg } from './svg-tools';

// watch glob
export const WATCH_GLOBS = ['./content/**/*.md', './layouts/**/*.html', './*.yaml'];

// cache directory
const CACHE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.cache/icons');

// available icon packs
const ICON_PACKS = {
  bi: 'https://raw.githubusercontent.com/twbs/icons/main/icons',
  logos: 'https://raw.githubusercontent.com/gilbarbara/logos/main/logos',
  tabler: 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons',
  'skill-icons': 'https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons',
  'simple-icons': 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons',
};

type IconPack = keyof typeof ICON_PACKS;

// default icon when the requested icon is not found
const FALLBACK_ICON = {
  innerHTML: '<rect width="24" height="24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />',
  props: {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    'aria-hidden': 'true',
  },
};

async function download(pack: IconPack, name: string, outputPath: string): Promise<boolean> {
  try {
    // build url
    const url = `${ICON_PACKS[pack]}/${name}.svg`;

    // download the icon
    const { data } = await axios.get(url);

    // write to cache
    await fs.writeFile(outputPath, data, { flag: 'w' });

    return true;
  } catch (error) {
    // icon is not found
    if (error instanceof AxiosError && error.response?.status === 404) {
      console.error(`Icon "${name}" does not exist in pack "${pack}"`);
    }

    const error2 = error as Error;
    console.error(error2.message);
    return false;
  }
}

async function processIcon(name: string) {
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
    // download the icon
    const result = await download(pack as IconPack, icon, cachePath);
    if (!result) return FALLBACK_ICON;

    // load svg contents
    const contents = await fs.readFile(cachePath, 'utf-8');

    // optimize SVG
    const data = optimizeSvg(contents);

    // write to cache
    await fs.writeFile(cachePath, data, { flag: 'w' });
  }
}

export async function makeDirs() {
  // create the cache dir
  for (const pack of Object.keys(ICON_PACKS)) {
    await fs.mkdir(path.join(CACHE_DIR, pack), { recursive: true });
  }
}

export async function handleFile(fileName: string) {
  console.log('Processing: ', path.basename(fileName));

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
  for (const icon of uniq(allMatches)) {
    console.log(`Processing icon '${icon}'...`);
    await processIcon(icon);
  }
}
