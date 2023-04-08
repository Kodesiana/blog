import fs from 'fs/promises';
import path from 'path';

import glob from 'glob';
import sharp from 'sharp';

(async () => {
  // glob all image files in public folder except *.min.* files
  const files = await glob('./public/**/!(*.min).{jpg,jpeg,png}');

  // for each file
  for (const file of files) {
    // get file size before optimization
    const beforeStat = await fs.stat(file);

    // load image
    const image = sharp(file);
    const metadata = await image.metadata();

    // optimize image
    let buffer: Buffer = Buffer.alloc(0);
    switch (metadata.format) {
      case 'jpg':
      case 'jpeg':
        buffer = await image.jpeg({ quality: 80 }).toBuffer();
        break;
      case 'png':
        buffer = await image.png({ quality: 80, compressionLevel: 8 }).toBuffer();
        break;
    }

    // write optimized image to file
    await fs.writeFile(file, buffer);

    // get file size after optimization
    const afterStat = await fs.stat(file);

    // log optimization result
    const sourceRelativePath = path.relative(process.cwd(), file);
    const beforeSize = beforeStat.size / 1024; // KB
    const afterSize = afterStat.size / 1024; // KB
    const savedSize = (beforeStat.size - afterStat.size) / 1024; // KB
    const savedPercent = Math.round((1 - afterStat.size / beforeStat.size) * 100);

    // prettier-ignore
    console.log(`Optimized image: ${sourceRelativePath}, before: ${beforeSize.toFixed(2)} KB, after: ${afterSize.toFixed(2)} KB, saved: ${savedSize.toFixed(2)} KB (${savedPercent}%)`);
  }
})();
