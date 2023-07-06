// Service worker
//
// References
// https://github.com/webmaxru/pwatter/blob/workbox/src/sw-default.js
// Caching strategies: https://developers.google.com/web/tools/workbox/modules/workbox-strategies#stale-while-revalidate
// Example: https://github.com/JeremieLitzler/mws.nd.2018.s3/blob/master/sw.js

import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import {
  CacheFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { clientsClaim } from "workbox-core";

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();

const componentName = "Service Worker";

// Enable debug mode during development
const DEBUG_MODE =
  location.hostname.endsWith(".app.local") || location.hostname === "localhost";

const DAY_IN_SECONDS = 24 * 60 * 60;
const MONTH_IN_SECONDS = DAY_IN_SECONDS * 30;
const YEAR_IN_SECONDS = DAY_IN_SECONDS * 365;

/**
 * The current version of the service worker.
 */
const SERVICE_WORKER_VERSION = "0.0.1";

if (DEBUG_MODE) {
  console.debug(`Service worker version ${SERVICE_WORKER_VERSION} loading...`);
}

// ------------------------------------------------------------------------------------------
// Precaching configuration
// ------------------------------------------------------------------------------------------
cleanupOutdatedCaches();

// Precaching
// Make sure that all the assets passed in the array below are fetched and cached
// The empty array below is replaced at build time with the full list of assets to cache
// This is done by workbox-build-inject.js for the production build
let assetsToCache = self.__WB_MANIFEST;
// To customize the assets afterwards:
assetsToCache = [...assetsToCache, "index.html"];

if (DEBUG_MODE) {
  console.trace(
    `${componentName}:: Assets that will be cached: `,
    assetsToCache
  );
}

precacheAndRoute(assetsToCache);

// ------------------------------------------------------------------------------------------
// Routes
// ------------------------------------------------------------------------------------------

// Default page handler for offline usage,
// where the browser does not how to handle deep links
// it's a SPA, so each path that is a navigation should default to index.html
const defaultRouteHandler = createHandlerBoundToURL("/index.html");
const defaultNavigationRoute = new NavigationRoute(defaultRouteHandler, {
  //allowlist: [],
  //denylist: [],
});
registerRoute(defaultNavigationRoute);

// Cache the Google Fonts stylesheets with a stale while revalidate strategy.
registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
  })
);

// Cache the Google Fonts webfont files with a cache first strategy for 1 year.
registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: YEAR_IN_SECONDS,
        maxEntries: 30,
        purgeOnQuotaError: true, // Automatically cleanup if quota is exceeded.
      }),
    ],
  })
);

// Make JS/CSS fast by returning assets from the cache
// But make sure they're updating in the background for next use
registerRoute(/\.(?:js|css)$/, new StaleWhileRevalidate());

// Cache images
// But clean up after a while
registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 250,
        maxAgeSeconds: MONTH_IN_SECONDS,
        purgeOnQuotaError: true, // Automatically cleanup if quota is exceeded.
      }),
    ],
  })
);

// Anything authentication related MUST be performed online
registerRoute(/(https:\/\/)?([^\/\s]+\/)api\/v1\/auth\/.*/, new NetworkOnly());

// Database access is only supported while online
registerRoute(/(https:\/\/)?([^\/\s]+\/)database\/.*/, new NetworkOnly());

// ------------------------------------------------------------------------------------------
// Messages
// ------------------------------------------------------------------------------------------
self.addEventListener(
  "message",
  (event: { data: any; type: any; ports: any }) => {
    // TODO define/use correct data type
    if (event && event.data && event.data.type) {
      // return the version of this service worker
      if ("GET_VERSION" === event.data.type) {
        if (DEBUG_MODE) {
          console.debug(
            `${componentName}:: Returning the service worker version: ${SERVICE_WORKER_VERSION}`
          );
        }
        event.ports[0].postMessage(SERVICE_WORKER_VERSION);
      }
    }
  }
);

// ------------------------------------------------------------------------------------------
// Notifications
// ------------------------------------------------------------------------------------------
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const notification = event.data.json();

  event.waitUntil(
    self.registration.showNotification(notification.title, notification)
  );
});
