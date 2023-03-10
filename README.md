# Youtube Summarized - Browser Extension

A chrome extension for generating YouTube summaries in note form using OpenAI.

> The Extension is available for free on the [Chrome Web Store](https://chrome.google.com/webstore/detail/youtube-summarized/nkndldfehcidpejfkokbeghpnlbppdmo).

<a href="https://youtubesummarized.com">
<img src="assets/icon.svg" alt="alt text" width="100%" height="128">
</a>

---

## Installing

1. Go to the [releases](https://github.com/jarle/youtube-summarized-browser-extension/releases) page and download the latest release
1. Unzip the release
1. Set up [Developer mode in your Chrome browser 'Developer mode'](https://developer.chrome.com/docs/extensions/mv3/faq/#faq-dev-01)
1. click 'Load unpacked', and select `build/` folder

## Developing

Must run on version 14 or newer of `node.js`.

Run the commands:

```shell
npm install
npm run dev
```

### Chrome Extension Developer Mode

1. Set up [Developer mode in your Chrome browser 'Developer mode'](https://developer.chrome.com/docs/extensions/mv3/faq/#faq-dev-01) if you haven't done so already
1. Click 'Load unpacked', and select the `build/` folder in this repo. It will be generated when you run `npm run dev`

### Developer Mode without extension

1. Popup page is available at [/popup.html](http://localhost:3000/popup.html)
1. Options page is available at [/options.html](http://localhost:3000/options.html)