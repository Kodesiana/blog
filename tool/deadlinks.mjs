import fs from "node:fs";
import { LinkChecker } from "linkinator";

// create Linkinator
const checker = new LinkChecker();

// create CSV stream
const stream = fs.createWriteStream("linkinator-report.csv");
stream.write("state\tstatus\turl\tparent\n");

// after page is scanned, write to CSV and console
checker.on("link", (result) => {
  if (result.state === "OK") {
    return;
  }

  stream.write(
    `${result.state}\t${result.status}\t${result.url}\t${result.parent}\n`,
  );
  console.log(
    ` [${result.state}] ${result.url} - HTTP ${result.status} - ${result.parent}`,
  );
});

// start scan
await checker
  .check({
    path: "http://localhost:1313",
    recurse: true,
    concurrency: 100,
    timeout: 1000,
    userAgent: "Mozilla/4.0 (compatible; MSIE 6.0; MSIE 5.5; Windows NT 5.1)",
    linksToSkip: [
      "linkedin.com",
      "facebook.com",
      "twitter.com",
      "clarity.ms",
      "telegram.me",
      "whatsapp.com",
      "reddit.com",
      "googlesyndication.com",
      "googletagmanager.com",
    ],
  })
  .then((results) => {
    // close CSV stream
    stream.close();

    // check to see if the scan passed!
    console.log(`Scanned total of ${results.links.length} links!`);

    // The final result will contain the list of checked links, and the pass/fail
    const brokeLinksCount = results.links.filter((x) => x.state === "BROKEN");
    console.log(`Detected ${brokeLinksCount.length} broken links.`);

    // exit
    process.exit(0);
  });
