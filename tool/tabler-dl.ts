import path from "path";
import { parseArgs } from "util";

// available icon packs
const tablerRoot = "https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/outline";

const { values } = parseArgs({
    args: Bun.argv,
    strict: true,
    allowPositionals: true,
    options: {
        name: {
            type: "string",
            multiple: false,
        },
    },
});

if (!values.name) {
    console.error("Icon name is not supplied")
    process.exit(1);
}

const iconsDir = path.resolve(import.meta.dir, `../assets/icons/${values.name}.svg`);
const response = await fetch(`${tablerRoot}/${values.name}.svg`);
if (!response.ok) {
  console.error("Failed to download icon!");
  console.error(response.statusText);
  process.exit(1);
}

const content = await response.arrayBuffer();
await Bun.write(iconsDir, content);

console.log("Icon downloaded.");
