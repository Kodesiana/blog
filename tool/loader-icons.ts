import glob from 'glob';
import chokidar from 'chokidar';

import { WATCH_GLOBS, handleFile, makeDirs } from './utils/icons';

(async () => {
  // create download directory
  await makeDirs();

  // check first argument, if it's --watch, then watch for changes
  if (process.argv[2] === '--watch') {
    // watch for changes
    chokidar.watch(WATCH_GLOBS).on('change', (f) => handleFile(f, true));

    console.info('Watching for file changes...');
  } else {
    // find all files
    const files = await glob(WATCH_GLOBS);

    // download all icons
    await Promise.all(files.map((file) => handleFile(file, false)));
  }
})();
