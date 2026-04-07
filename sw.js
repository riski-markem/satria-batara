self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
    // Service worker jalan agar Chrome mendeteksi ini sebagai PWA
});