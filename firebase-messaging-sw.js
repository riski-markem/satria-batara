// ================================================================
// firebase-messaging-sw.js
// FILE INI HARUS DILETAKKAN DI ROOT SERVER (folder yang sama dengan customer.html)
// Contoh: public/firebase-messaging-sw.js  atau  www/firebase-messaging-sw.js
// ================================================================

importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// ── Salin konfigurasi Firebase yang sama dengan customer.html ──
firebase.initializeApp({
    apiKey: "AIzaSyCpuh2KBc_eBMY9uvpLF3NM4q4NjLXpLWQ",
    authDomain: "satria-batara.firebaseapp.com",
    databaseURL: "https://satria-batara-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "satria-batara",
    storageBucket: "satria-batara.firebasestorage.app",
    messagingSenderId: "907483766943",
    appId: "1:907483766943:web:eec4cc45323300d87e42aa"
});

const messaging = firebase.messaging();

// ── NOTIFIKASI BACKGROUND (saat HP/browser tidak membuka aplikasi) ──
// Firebase menangani ini secara otomatis jika payload memiliki field "notification".
// Jika kamu mengirim "data-only" payload dari server, tangani di sini:

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Menerima pesan background:', payload);

    const notificationTitle = payload.notification?.title || '🛵 Satria Batara';
    const notificationOptions = {
        body: payload.notification?.body || 'Ada pembaruan pesanan kamu!',
        icon: '/logo-satria.png',
        badge: '/logo-satria.png',
        vibrate: [200, 100, 200],
        tag: payload.data?.tag || 'satria-notif',
        data: {
            url: payload.data?.url || '/'
        },
        actions: [
            { action: 'lihat', title: '📍 Lihat Pesanan' },
            { action: 'tutup', title: 'Tutup' }
        ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// ── HANDLE KLIK NOTIFIKASI → BUKA APLIKASI ──
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    if (event.action === 'tutup') return;

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
            // Jika aplikasi sudah terbuka → fokus ke sana
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Jika belum terbuka → buka tab baru
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
