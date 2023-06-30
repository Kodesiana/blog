import url from 'url';
import http from 'http';
import path from 'path';
import fs from 'fs/promises';

import { MIME_TYPE } from './utils/mime.mjs';

const ROOT_DIR = path.resolve(url.fileURLToPath(import.meta.url), '..', '..');

const port = parseInt(process.argv[2] || '9000');

(async () => {
  // check if the serve directory exists
  const serveDir = path.resolve(ROOT_DIR, './public');
  await fs.stat(serveDir).catch(() => {
    console.error(`The serve directory ${serveDir} is not a directory`);
    process.exit(1);
  });

  // create server
  http
    .createServer(function (req, res) {
      // parse URL
      const parsedUrl = url.parse(req.url);

      // extract URL path
      // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
      // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
      // by limiting the path to current directory only
      const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
      let pathname = path.join(serveDir, sanitizePath);

      fs.stat(pathname)
        .then(async (stat) => {
          // if is a directory, then look for index.html
          if (stat.isDirectory()) {
            pathname += '/index.html';
          }

          // read file from file system
          fs.readFile(pathname)
            .then((data) => {
              // based on the URL path, extract the file extention. e.g. .js, .doc, ...
              const ext = path.parse(pathname).ext;

              // @ts-expect-error - we have a fallback mime type
              const mime = MIME_TYPE[ext] || 'text/plain';
              res.setHeader('Content-type', mime);
              res.end(data);

              console.log(`${req.method} [200] ${req.url}`);
            })
            .catch((err) => {
              // cannot read file
              res.statusCode = 500;
              res.end(`Error getting the file.`);

              console.log(`${req.method} [500] ${req.url}`);
              console.error(err);
            });
        })
        .catch((err) => {
          // if the file is not found, return 404
          res.statusCode = 404;
          res.end(`File ${pathname} not found!`);

          console.log(`${req.method} [404] ${req.url}`);
          console.error(err);
        });
    })
    .listen(port);

  console.log(`Server listening on port ${port}`);
})();
