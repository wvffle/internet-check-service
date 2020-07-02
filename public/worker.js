importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')

workbox.routing.registerRoute(
    ({ url }) => ['http://localhost:3000', 'https://czy.wyjebalo.net', 'https://wyjebalo.net'].includes(url.origin),
    new workbox.strategies.NetworkFirst()
)
