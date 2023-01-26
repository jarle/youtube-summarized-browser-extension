import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  name: 'YouTube Summarized',
  description: 'YouTube videos summarized by AI.',
  version: '0.0.1',
  manifest_version: 3,
  icons: {
    '16': 'img/16x16.png',
    '32': 'img/32x32.png',
    '64': 'img/64x64.png',
    '128': 'img/128x128.png',
    '256': 'img/256x256.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/128x128.png',
  },
  options_page: 'options.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: [
        "*://youtube.com/*",
        "*://www.youtube.com/*"
      ],
      js: ['src/content/index.ts'],
    },
  ],
  host_permissions: [
    "https://video-summarizer-gateway-6rjhapzj.uc.gateway.dev/",
    "*://youtube.com/*",
    "*://www.youtube.com/*"
  ],
  web_accessible_resources: [
    {
      resources: ['img/16x16.png', 'img/32x32.png', 'img/64x64.png', 'img/128x128.png', 'img/256x256.png'],
      matches: [],
    },
  ],
  permissions: [
    "storage",
  ],
})
