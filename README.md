# Kodesiana.com❤️

Hello guys! I'm very excited to share my blog, built using Hugo and Tailwind with all sorts of NPM package magic built in. This is my answer to today's state of frontend tools like React, Next, Astro, and 11ty which doesn't really fit into static site generation.

> This repo is actually the third rewrite of my blog😂
> The previous theme where I used Tailwind and all that scored really low on Lighthouse and it's not great on mobile

## Built with

This site is built using Hugo, based on the [PaperMod theme](https://github.com/adityatelange/hugo-PaperMod). Many thanks to adityatelange for the amazing template!

Based on my previous codebase, I also bring some features like automatic SVG icon download and local hugo installation, all with NodeJS 18.

## Scripts

- `dev`, runs a Hugo server
- `build`, downloads all SVG icons andn build Hugo in production mode
- `preview`, same as build but the last step is running a web server (not using `hugo server`).

## The new Kodesiana.com

> Note: this is for reference only, only valid for commit #22022b56a230cd7bfdd98d7f85af5da1656e9987 and older

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
- Latex math rendering (MathJax)
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
