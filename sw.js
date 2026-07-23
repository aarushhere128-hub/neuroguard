const BASE = "/neuroguard/";
const CACHE_NAME = "neuroguard-v1.0.0";


const FILES_TO_CACHE = [
    BASE,
    BASE + "index.html",
    BASE + "login.html",
    BASE + "signup.html",
    BASE + "contact.html",
    BASE + "privacy.html",
    BASE + "health-info.html",
    BASE + "results.html",
    BASE + "fast-test.html",
    BASE + "face_test.html",
    BASE + "speech_test.html",
    BASE + "arm_test.html",


    BASE + "css/style.css",
    BASE + "css/admin.css",
    BASE + "css/animations.css",
    BASE + "css/arm.css",
    BASE + "css/components.css",
    BASE + "css/face.css",
    BASE + "css/responsive.css",
    BASE + "css/speech.css",
    BASE + "css/variables.css",

    BASE + "js/app.js",
    BASE + "js/admin.js",
    BASE + "js/animations.js",
    BASE + "js/arm.js",
    BASE + "js/components.js",
    BASE + "js/face.js",
    BASE + "js/firebase.js",
    BASE + "js/health-info.js",
    BASE + "js/language.js",
    BASE + "js/login.js",
    BASE + "js/navbar-auth.js",
    BASE + "js/navigation.js",
    BASE + "js/results.js",
    BASE + "js/risk-engine.js",
    BASE + "js/signup.js",
    BASE + "js/speech.js",
    BASE + "js/theme.js",

    BASE + "assets/logo.png",
    BASE + "assets/icon-192.png",
    BASE + "assets/icon-512.png",
    BASE + "assets/img1.png",
    BASE + "assets/img2.png",
    BASE + "assets/img3.png",
    BASE + "assets/img4.png",
    BASE + "assets/img5.png",

    BASE + "model/model.json",
    BASE + "model/metadata.json",
    BASE + "model/weights.bin"
];

// Install
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request)
            .then(response => {

                // Only cache files from YOUR website
                if (new URL(event.request.url).origin === self.location.origin) {

                    const clone = response.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clone);
                    });

                }

                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
