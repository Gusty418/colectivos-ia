const CACHE_NAME = "colectivos-v2";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./manifest.json"
];

self.addEventListener("install", function(event) {

    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            return cache.addAll(ARCHIVOS);
        })
    );

});


self.addEventListener("activate", function(event) {

    event.waitUntil(

        caches.keys().then(function(keys) {

            return Promise.all(

                keys.map(function(key) {

                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }

                })

            );

        })

    );

    self.clients.claim();

});


self.addEventListener("fetch", function(event) {

    /*
       Para index.html y archivos principales:
       primero intenta obtener la versión nueva
       desde Internet.

       Si no hay Internet, usa la versión guardada.
    */

    if (
        event.request.method === "GET" &&
        (
            event.request.url.endsWith("/index.html") ||
            event.request.url.endsWith("/manifest.json") ||
            event.request.url.endsWith("/")
        )
    ) {

        event.respondWith(

            fetch(event.request)
            .then(function(response) {

                const copia =
                    response.clone();

                caches.open(CACHE_NAME)
                .then(function(cache) {

                    cache.put(
                        event.request,
                        copia
                    );

                });

                return response;

            })
            .catch(function() {

                return caches.match(
                    event.request
                );

            })

        );

        return;

    }


    /*
       Para el resto de archivos:
       usamos caché si existe y,
       si no, Internet.
    */

    event.respondWith(

        caches.match(event.request)
        .then(function(respuesta) {

            if (respuesta) {
                return respuesta;
            }

            return fetch(event.request);

        })

    );

});
