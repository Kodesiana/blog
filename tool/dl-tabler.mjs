import path from "node:path";
import fs from "node:fs/promises";
import { Readable } from 'node:stream'
import { fileURLToPath } from "url";

import commandLineArgs from 'command-line-args'

const args = commandLineArgs([
  { name: 'name', type: String },
])

// available icon packs
const tablerRoot = "https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline";

if (!args.name) {
  console.error("Icon name is not supplied");
  process.exit(1);
}

const res = await fetch(`${tablerRoot}/${args.name}.svg`);
if (!res.ok) {
  console.error("Failed to download icon!");
  console.error(res.statusText);
  process.exit(1);
}

const savePath = path.resolve(fileURLToPath(import.meta.url), `../../assets/icons/${args.name}.svg`);
await fs.writeFile(savePath, Readable.fromWeb(res.body));

console.log("Icon downloaded.");
