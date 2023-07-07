import { VitePWA as pwa } from "vite-plugin-pwa";

export default () =>
  pwa({
    strategies: "injectManifest",
    srcDir: "src",
    filename: "sw.ts",
    manifest: {
      short_name: "Ionic App",
      name: "My Ionic App",
      icons: [
        {
          src: "icons/icon-48.webp",
          type: "image/png",
          sizes: "48x48",
        },
        {
          src: "icons/icon-72.webp",
          type: "image/png",
          sizes: "72x72",
        },
        {
          src: "icons/icon-96.webp",
          type: "image/png",
          sizes: "96x96",
        },
        {
          src: "icons/icon-128.webp",
          type: "image/png",
          sizes: "128x128",
        },
        {
          src: "icons/icon-192.webp",
          type: "image/png",
          sizes: "192x192",
        },
        {
          src: "icons/icon-256.webp",
          type: "image/png",
          sizes: "256x256",
        },
        {
          src: "icons/icon-512.webp",
          type: "image/png",
          sizes: "512x512",
        },
      ],
      background_color: "#ffffff",
      theme_color: "#ffffff",
      start_url: ".",
      display: "standalone",
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  });
