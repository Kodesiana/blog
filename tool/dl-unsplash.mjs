import extractUrls from "extract-urls";
import commandLineArgs from 'command-line-args'

const args = commandLineArgs([
  { name: 'url', type: String },
])

if (!args.url) {
  console.error("Unsplash URL must be supplied");
  process.exit(1);
}

if (!args.url.startsWith("https://unsplash.com")) {
  console.error("Unsplash URL must start with https://unsplash.com");
  process.exit(1);
}

const response = await fetch(args.url);
const content = await response.text();

// extract URL from HTML body
const urls = extractUrls(content).filter(
  (x) =>
    x.includes("https://images.unsplash.com") &&
    x.includes("ixid") &&
    x.includes("auto="),
);

if (urls.length === 0) {
  console.log("No URL detected");
  process.exit(1);
}

// parse image hotlink URL
const imageUrl = new URL(urls[0]);

// extract credit from HTML body
const creator = /Photo by [\w ]+ on Unsplash/;
const creatorMatches = creator.exec(content);
const creatorCredit = creatorMatches ? creatorMatches[0] : "Unsplash";

// extract image caption
const resUrl = new URL(response.url);
let caption = resUrl.pathname.replaceAll("/photos/", "");
caption = caption.slice(0, caption.lastIndexOf("-"));
caption = caption.replaceAll("-", " ");

console.log(
  `{{< unsplash "${imageUrl.pathname.substring(1)}" "${imageUrl.searchParams.get("ixid")}" "${creatorCredit}" "${caption}" >}}`,
);
