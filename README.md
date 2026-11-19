# Sharmila Technologies — Learning R With Ease

An interactive, static learning portal for R and statistical learning, from first steps to advanced practice. It is built with plain HTML, CSS, and JavaScript and is designed for GitHub Pages.

**Live site:** <https://masterj23s25j27-sys.github.io/STATISTICAL-LEARNING-PAGES/>

The full site is also pushed to the private [`STATISTICAL-LEARNING` repository](https://github.com/masterj23s25j27-sys/STATISTICAL-LEARNING). A site-only public copy in [`STATISTICAL-LEARNING-PAGES`](https://github.com/masterj23s25j27-sys/STATISTICAL-LEARNING-PAGES) serves the live page so the private repository can stay private.

## Run it locally

Open `index.html` in a browser. No package install or build process is required. Session pages use links such as `session.html?lesson=01`, so they work on GitHub Pages and from a local file.

## What learners can do

- Follow 18 short sessions from R setup through statistical learning, modeling, validation, and a capstone.
- Search and filter the session list by learning stage.
- Take a quick knowledge check on the home page and a quiz in each session.
- Copy R examples, write personal notes, and mark sessions complete.
- Continue from a phone, tablet, or desktop. Notes and progress are saved in that browser's local storage.

## Add a session

Add one lesson object to `sessions.js`. The home page, stage counts, session sidebar, and previous/next links are generated from that list. See [ADDING_SESSIONS.md](ADDING_SESSIONS.md) for the lesson fields and workflow.

## Publish on GitHub Pages

The public `STATISTICAL-LEARNING-PAGES` repository publishes its root using GitHub Actions. Push the site files there and the workflow deploys the home page. Keep its copy of `sessions.js` and the lesson pages in sync with this private source snapshot when you add sessions.

## Local storage

Notes and completion state are stored only in the learner's current browser, under `localStorage`. Clearing browser site data clears that progress. The site does not send learner notes to a server.
