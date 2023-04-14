/* eslint-disable no-useless-escape */

import fs from 'fs';
import url from 'url';
import http from 'http';
import path from 'path';
import zlib from 'zlib';
import fsPromises from 'fs/promises';

import { MIME_TYPE } from './data/mime';

const ROOT_DIR = path.resolve(url.fileURLToPath(import.meta.url), '..', '..');

const port = parseInt(process.argv[2] || '9000');

(async () => {
  // check if the serve directory exists
  const serveDir = path.resolve(ROOT_DIR, './public');
  await fsPromises.stat(serveDir).catch(() => {
    console.error(`The serve directory ${serveDir} is not a directory`);
    process.exit(1);
  });

  // create server
  http
    .createServer(function (req, res) {
      // parse URL
      const parsedUrl = url.parse(req.url!);

      // extract URL path
      // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
      // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
      // by limiting the path to current directory only
      const sanitizePath = path.normalize(parsedUrl.pathname!).replace(/^(\.\.[\/\\])+/, '');
      let pathname = path.join(serveDir, sanitizePath);

      fsPromises
        .stat(pathname)
        .then(async (stat) => {
          // if is a directory, then look for index.html
          if (stat.isDirectory()) {
            pathname += '/index.html';
          }

          const stream = fs.createReadStream(pathname);
          stream.on('error', function (err) {
            // cannot read file
            res.statusCode = 500;
            res.end(`Error getting the file.`);

            console.log(`${req.method} [500] ${req.url}`);
            console.error(err);
          });

          // based on the URL path, extract the file extention. e.g. .js, .doc, ...
          const ext = path.parse(pathname).ext;

          // get accepted encodings
          const acceptEncoding = req.headers['accept-encoding'];
          const encodings: string[] = [];
          if (typeof acceptEncoding === 'string') {
            encodings.push(acceptEncoding);
          } else if (Array.isArray(acceptEncoding)) {
            encodings.push(...acceptEncoding);
          }

          // @ts-expect-error - we have a fallback mime type
          const mime = MIME_TYPE[ext] || 'text/plain';
          res.setHeader('content-type', mime);

          // write according to stream
          if (encodings.some((x) => x.includes('br'))) {
            res.setHeader('content-encoding', 'br');
            stream.pipe(zlib.createBrotliCompress()).pipe(res);
          } else if (encodings.some((x) => x.includes('deflate'))) {
            res.setHeader('content-encoding', 'deflate');
            stream.pipe(zlib.createDeflate()).pipe(res);
          } else if (encodings.some((x) => x.includes('gzip'))) {
            res.setHeader('content-encoding', 'gzip');
            stream.pipe(zlib.createGzip()).pipe(res);
          } else {
            stream.pipe(res);
          }

          console.log(`${req.method} [200] ${req.url}`);
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
