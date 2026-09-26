const CACHE_NAME = "colectivos-v1";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./manifest.json"
];


self.addEventListener(
    "install",
    function(event) {

        event.waitUntil(

            caches.open(CACHE_NAME)
            .then(function(cache) {

                return cache.addAll(
                    ARCHIVOS
                );

            })

        );

    }
);


self.addEventListener(
    "fetch",
    function(event) {

        event.respondWith(

            caches.match(
                event.request
            )
            .then(function(respuesta) {

                if (respuesta) {
                    return respuesta;
                }

                return fetch(
                    event.request
                );

            })

        );

    }
);