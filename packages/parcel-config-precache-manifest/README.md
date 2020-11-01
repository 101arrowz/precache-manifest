# parcel-config-precache-manifest

A Parcel 2 plugin that generates a manifest for precaching assets

## Usage
In `.parcelrc`:
```json
{
  "extends": ["@parcel/config-default", "parcel-config-precache-manifest"]
}
```

This will inject a precache manifest similar to the following into all service workers:
```js
self.__precacheManifest = [
  { url: '/index.fe3a45.js', revision: 'fe3a45' },
  { url: '/my-custom-icon.svg', revision: '3b68dc' },
  ...
]
```

To use the manifest with [Workbox](https://developers.google.com/web/tools/workbox/), write the following in your service worker:
```js
import workbox from 'workbox-sw';

workbox.precaching.precacheAndRoute(self.__precacheManifest);
```

To use the manifest manually and precache yourself:
```js
const precacheVersion = self.__precacheManifest
  .map(p => p.revision)
  .join('');
const precacheFiles = self.__precacheManifest.map(p => p.url);

self.addEventListener('install', ev => {
  // Do not finish installing until every file in the app has been cached
  ev.waitUntil(
    caches.open(precacheVersion).then(
      cache => cache.addAll(precacheFiles)
    )
  );
});

// Optionally, to clear previous precaches, also use the following:
self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== precacheVersion).map(
        k => caches.delete(k)
      )
    ))
  );
});
```

Please note that this plugin supports *Parcel 2 only*. See [`parcel-plugin-precache-manifest`](https://npmjs.com/package/parcel-plugin-precache-manifest) for a plugin that supports Parcel 1.

## Why?
Precaching is a fundamental part of any PWA. When offline, the browser cannot make any network requests, so every file crucial to your app must be stored in a persistent cache. However, it's impossible to know which files to cache during the `'install'` event without some sort of manifest, which is what this plugin allows you to generate.

This plugin can be thought of as a port of [`workbox-webpack-plugin`'s `InjectManifest`](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#injectmanifest) to Parcel.

## Advanced: Filters
By default, service workers will not be precached, since they are automatically cached by the browser until a new service worker is discovered. To prevent the caching of a specific type of file (say all `.png` files), you can filter the items in `self.__precacheManifest` at the top of the service worker itself:
```js
self.__precacheManifest = self.__precacheManifest.filter(
  item => !/\.png$/.test(item.url)
);
// Rest of your service worker code
```

## License
MIT