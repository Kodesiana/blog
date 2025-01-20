import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { Readable } from 'node:stream'
import { execSync } from "child_process";
import { fileURLToPath } from "url";

import { fileExists } from "./_utils.mjs";

// github release API and download directory
const RELEASE_API = "https://api.github.com/repos/gohugoio/hugo/releases/latest";
const DOWNLOAD_DIR = path.resolve(fileURLToPath(import.meta.url), "..", "..", ".bin");

(async () => {
  // create download directory if it doesn't exist
  await fs.mkdir(DOWNLOAD_DIR, { recursive: true });

  // check if the hugo binary already exists
  if (await fileExists(path.resolve(DOWNLOAD_DIR, "hugo"))) {
    console.log("Hugo already exists, skipping download.");
    process.exit(0);
  }

  // download latest hugo release
  console.log("Loading Hugo release info...");
  const releaseResponse = await fetch(RELEASE_API);
  const release = await releaseResponse.json();
  console.log("Current Hugo version:", release.tag_name);

  // find the correct asset for the current platform
  console.log("Finding latest Hugo release...");
  const osArch = os.arch().substring(1);
  const osPlatform = os.platform();

  const asset = release.assets.find((asset) => {
    return (
      asset.name.includes("extended") &&
      asset.name.includes(osPlatform) &&
      asset.name.includes(osArch) &&
      asset.name.endsWith(".tar.gz")
    );
  });

  // if no asset was found, exit
  if (!asset) {
    console.log("Could not find a suitable Hugo release for your platform.");
    process.exit(1);
  }

  // download the asset
  console.log("Downloading Hugo release...");
  const hugoRes = await fetch(asset.browser_download_url);

  // save the asset to disk
  const saveFileName = path.resolve(DOWNLOAD_DIR, path.basename(asset.name));
  await fs.writeFile(saveFileName, Readable.fromWeb(hugoRes.body));

  // extract the asset
  console.log("Extracting Hugo release...");
  execSync(`tar -xvzf '${saveFileName}' hugo`, {cwd: DOWNLOAD_DIR});

  // delete the downloaded asset
  console.log("Cleaning up...");
  fs.unlink(saveFileName);

  console.log("Done.");
})();
