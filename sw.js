/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "base.css",
    "revision": "7bd3ebde5226cf059078dd288eebc2f0"
  },
  {
    "url": "data.js",
    "revision": "9f0595df2423a8839261fd9323b607c3"
  },
  {
    "url": "edit.css",
    "revision": "23bec59217bc958b0fe9dc50169d0359"
  },
  {
    "url": "edit.html",
    "revision": "1d776571eec388cbe25dcd30d555f17e"
  },
  {
    "url": "edit.js",
    "revision": "7f56442c50b9d36785740d6ee102b5ad"
  },
  {
    "url": "favicon.ico",
    "revision": "62e4bcf5d46e827bf586feb0a9afce33"
  },
  {
    "url": "favicon.js",
    "revision": "f41cfa2274982e21ef4133725de5bce3"
  },
  {
    "url": "firebase.json",
    "revision": "93f84675c80cf97a2dba3fe2b592871c"
  },
  {
    "url": "index.html",
    "revision": "7d667b0b0b045d820d967fde220694f7"
  },
  {
    "url": "jquery-3.3.1.min.js",
    "revision": "a09e13ee94d51c524b7e2a728c7d4039"
  },
  {
    "url": "lzma/lzma_worker-min.js",
    "revision": "cffdefcc7477466752a3433488c43036"
  },
  {
    "url": "lzma/lzma-d-min.js",
    "revision": "479348a6c784569a86b26be4a7cd3c1c"
  },
  {
    "url": "manifest.appcache",
    "revision": "db490bd7f0014410fc3019d8b8a9d3e3"
  },
  {
    "url": "package-lock.json",
    "revision": "bab2c3b01ca03a54d87fcc523ac8df78"
  },
  {
    "url": "package.json",
    "revision": "4f90529c33d7bba40d10faed4e7fd325"
  },
  {
    "url": "README.md",
    "revision": "8122fe9752192067288b72024ccf523d"
  },
  {
    "url": "workbox-config.js",
    "revision": "53c01cc4790b99ea0088d203a20a9e58"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
