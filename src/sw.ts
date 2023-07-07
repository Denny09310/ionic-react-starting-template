import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import {
  NetworkOnly,
  StaleWhileRevalidate,
  CacheFirst,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;

const componentName = "Service Worker";

// Enable debug mode during development
const DEBUG_MODE =
  location.hostname.endsWith(".app.local") || location.hostname === "localhost";

const DAY_IN_SECONDS = 24 * 60 * 60;
const MONTH_IN_SECONDS = DAY_IN_SECONDS * 30;

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

if (DEBUG_MODE) {
  // To customize the assets afterwards:
  assetsToCache = [...assetsToCache, "index.html"];
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
const indexUrl = `${import.meta.env.BASE_URL}index.html`;
const defaultRouteHandler = createHandlerBoundToURL(indexUrl);
const defaultNavigationRoute = new NavigationRoute(defaultRouteHandler, {
  //allowlist: [],
  //denylist: [],
});
registerRoute(defaultNavigationRoute);

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

      // When this message is received, we can skip waiting and become active
      // (i.e., this version of the service worker becomes active)
      // Reference about why we wait: https://stackoverflow.com/questions/51715127/what-are-the-downsides-to-using-skipwaiting-and-clientsclaim-with-workbox
      if ("SKIP_WAITING" === event.data.type) {
        if (DEBUG_MODE) {
          console.debug(`${componentName}:: Skipping waiting...`);
        }
        self.skipWaiting();
      }

      // When this message is received, we can take control of the clients with this version
      // of the service worker
      if ("CLIENTS_CLAIM" === event.data.type) {
        if (DEBUG_MODE) {
          console.debug(
            `${componentName}:: Claiming clients and cleaning old caches`
          );
        }
        self.clients.claim();
      }
    }
  }
);

// ------------------------------------------------------------------------------------------
// Notifications
// ------------------------------------------------------------------------------------------
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  event.waitUntil(self.registration.showNotification(data.title, data));
});
