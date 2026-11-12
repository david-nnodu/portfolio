# Danfo: David Nnodu's Portfolio

**Name:** David Nnodu
**Matric number:** 24120111113
**Course:** CSC 419, Advances in Web, Mobile and Blockchain Development

**Live site:** https://david-nnodu.github.io/portfolio/

A personal portfolio themed as a ride on a Lagos danfo bus. Each section is a stop,
the projects are stops along the route, and the contact button is "Owa!", what
passengers shout to get dropped off.

## Pages

- `index.html`: About (the Driver), Projects (the route), Contact (Owa!)
- `project.html`: full details for one project, linked from Stop 01
- `404.html`: custom "Wrong bus" page for missing URLs

## Features

- Fully responsive: the projects route runs horizontally on desktop and turns vertical on tablet and mobile
- "NEPA" switch for dark mode, remembered across pages
- A small bus that drives along the route as you hover or scroll through projects
- Semantic HTML, CSS custom properties, Flexbox and Grid, vanilla JavaScript
- Respects reduced-motion settings; keyboard and screen-reader friendly

## Built with

HTML, CSS and vanilla JavaScript. No frameworks and no build step.
Fonts: Bungee and Space Mono (Google Fonts).

## Project structure

```
index.html
project.html
404.html
css/styles.css
js/main.js
assets/img/
```

## Run locally

Open `index.html` in a browser.

## Deploy (GitHub Pages)

1. Push this folder to a public repo named `portfolio`.
2. Settings → Pages → Deploy from a branch → `main`, `/ (root)`.
3. The site appears at `https://david-nnodu.github.io/portfolio/`.

If the repo has a different name, change `/portfolio/` in `404.html` to match.
