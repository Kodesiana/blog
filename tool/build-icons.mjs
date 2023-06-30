import fs from "fs";
import fsPromises from "fs/promises";''

import {glob} from 'glob';

import { WATCH_GLOBS, SVG_GLOBS, handleFile, makeDirs } from './utils/icons.mjs';

(async () => {
  // create download directory
  await makeDirs();

  // find all source files
  const sourceFiles = await glob(WATCH_GLOBS);

  // download all icons
  await Promise.all(sourceFiles.map((file) => handleFile(file, false)));

  // find all SVG files
  const svgFiles = await glob(SVG_GLOBS);

  // generate svg.html
  const writer = fs.createWriteStream("./layouts/partials/svg.html", { flags: "w" });
  
  // write beginning of svg.html
  writer.write('{{- $icon_name := ( trim .name " " | lower )}}\n');

  // read all SVG files
  let isFirst = true;
  for (const file of svgFiles) {
    // parse file name
    const pathParts = file.split('/');
    const name = pathParts.pop().split('.')[0];
    const pack = pathParts.pop();
    writer.write(`{{- ${isFirst ? '' : 'else'} if (eq $icon_name "${pack}:${name}") -}}\n`);

    // write SVG
    const contents = await fsPromises.readFile(file, 'utf-8');
    writer.write(contents);
    writer.write('\n');

    isFirst = false;
  }

  // write fallback icon
  writer.write('{{- else if $icon_name -}}\n');
  writer.write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"\n');
  writer.write('    stroke-linecap="round" stroke-linejoin="round">\n');
  writer.write('    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>\n');
  writer.write('    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>\n');
  writer.write('</svg>\n');
  writer.write('{{- end -}}\n');

  // close stream
  writer.close();
})();
