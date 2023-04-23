# Kodesiana.com❤️

Hello guys! I'm very excited to share my blog, built using Hugo and Tailwind with all sorts of NPM package magic built in. This is my answer to today's state of frontend tools like React, Next, Astro, and 11ty which doesn't really fit into static site generation.

Shout out to [Astrowind](https://github.com/onwidget/astrowind), the original creator of this theme for Astro!

## Built with

This site is mainly built using Hugo and Tailwind, but it also heavily rely on Flowbite as component library, PostCSS to transform the CSS, Partytown to offload script loading to service worker, FlexSearch to search for articles, Mermaid for diagramming, ApexCharts for displaying charts, Katex for math typesetting, Lazysizes and medium-zoom for image lazy-loading and zoom effect.

Not only that, I also created several scripts to:

1. Installs hugo after `npm install` (using `axios`, `decompress`),
2. Sync and download remote data to Hugo data directory (using `chokidar`, `axios`, etc.),
3. Sync and download SVG icons from GitHub and optimize it (using `svgo`),
4. Optimize images before publish (using `sharp`).

You can say I pretty much reinvented almost every major features of modern JS framework like NextJS, only to make it work with Hugo. BUT WHY??? (Check the bottom of the readme!)

## Scripts

- `dev`, downloads remote data, runs a Hugo server, `postcss` in watch mode, and SVG icon loader script.
- `build`, downloads remote data, downloads all SVG icons, build Hugo in production mode, and optimize images in `public` directory.
- `preview`, same as build but the last step is running a web server (not using `hugo server`).

## The new Kodesiana.com

As stated before, Kodesiana.com is now using Hugo and Tailwind. I also created some custom tooling to download icons, optimize images, download data, and many more. You can check it at the `tool` directory.

This site supports:

- Dark mode
- SEO meta tags
- OpenGraph
- Schema.org rich data
- Sitemap XML
- Partytown (temporarily removed)
- Search index in JSON + fuzzy search (FlexSearch)
- Syntax highlighter (PrismJS)
- Latex math rendering (KaTeX)
- Image lazy loading
- Medium zoom
- SVG icon pack (tabler, etc.) with auto reload
- Image optimization
- Remote data fetching
- Local hugo installation
- "Preview" web server with compression
- ESlint/Prettier
- Google Analytics
- Google AdSense
- Microsoft Clarity
- Mailchimp Form

### Frontmatter

This site also supports these frontmatter options.

Mandatory:

- title: string
- category: string
- tags: array
- date: date

Optional:

- subtitle: string
- summary: string
- keywords: array
- lastmod: date
- lang: id/en
- draft: true/false
- math: true/false
- hideMeta: true/false
- hideToc: true/false
- images: array
- slug: string

## Why Hugo and NPM?

If you know the story of my blog, my blog is originally built using Hugo and about 6 month ago, I want to rewrite my blog to other framework because (1) I'm not really familiar customizing Hugo site (I never really learned it), (2) a lot of my friends are using Vite + React and NextJS, and (3) I also wanted to learn new frameworks like NextJS and Astro because it supports static site generation and a lot of other features.

Long story short, I learned NextJS and Astro to some degree and even finished rewriting my blog into Astro at some point. Unfortunately, when I tried to release it, Github Actions crashed.

Wait, what?

### The story with Astro

The Github Actions agent runner had ran out of memory (JS heap out of memory). I was riddled, I can build my Astro site on my PC (32 GB of memory) but why not on Github Actions? So I checked the docs and Github Actions actually allows up to 2 GB of memory per runner. So that means my Astro site requires more than 2 GB of memory.

Surprise surprise, when I record the Astro build process, it takes up to 3.2 GB of memory when building! Yes I used a lot of `rehype`/`remark` plugins, a lot of in-memory cache, etc. but it just weird that it takes that much of memory. It turns out it is pretty normal since Astro uses Vite and that's how Rollup works (uses a lot of in-memory cache).

### The story with NextJS

At some point I also tried NextJS, but I never finished rewriting my site to Next, because it comes with another problem, the `__NEXTDATA` script tag on the rendered HTML page. The build script says some of my pages has too large data for a single page and I know why, it is because all the page props are stored in it along with all of my Markdown page contents there, so a single page contains duplicated data.

Without looking at the memory consumption of the build process, NextJS automatically disqualified from my list.

From these two experience, I hesitated to even try 11ty or Gatsby, I'm tired and don't want to learn other unnecessary frameworks again (I'm just a backend developer, you know :smile:)

So I returned to my only working solution, **Hugo**. I'm determined to learn Hugo and use it to create the new Kodesiana.com. It turns out Hugo has a lot of interesting features and integrations with many NPM packages.
