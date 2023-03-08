export const manifest = {
  name: 'YouTube Summarized',
  description: 'YouTube videos summarized by AI.',
  version: '0.0.11',
  manifest_version: 3,
  icons: {
    '144': 'img/xxhdpi.png'
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/xxhdpi.png',
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
      js: ['src/content/index.tsx'],
    },
  ],
  host_permissions: [
    "*://api.youtubesummarized.com/*",
    "*://youtube.com/*",
    "*://www.youtube.com/*"
  ],
  permissions: [
    "storage",
  ],
}
