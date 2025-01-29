import { JSDOM } from "jsdom";
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

// fetch the page
const response = await fetch(args.url);
const content = await response.text();
const dom = new JSDOM(content);

// extract credit
const creditElement = dom.window.document.querySelector('meta[property~="og:title"]')
const credit = creditElement?.getAttribute("content") ?? "Unsplash";

// extract image caption
// const caption = new URL(response.url).pathname.split("/").pop(-1).split("-").slice(0, -1).join(" ");
const caption = dom.window.document.querySelector("h1").textContent;

// extract image URL
const imageElement = dom.window.document.querySelector('meta[property~="og:image"]');
if (!imageElement) {
  console.error("Could not find image URL");
  process.exit(1);
}

const imageUrl = new URL(imageElement.getAttribute("content"));
const imageId = imageUrl.pathname.substring(1);
const ixid = imageUrl.searchParams.get("ixid");

// print the shortcode
console.log(`{{< unsplash "${imageId}" "${ixid}" "${credit}" "${caption}" >}}`);
