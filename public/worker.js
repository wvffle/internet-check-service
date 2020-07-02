importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')

workbox.routing.registerRoute(
    ({ url }) => ['http://localhost:3000', 'https://czy.wyjebalo.net', 'https://wyjebalo.net'].includes(url.origin) && !url.origin.endsWith('?check'),
    new workbox.strategies.NetworkFirst()
)
