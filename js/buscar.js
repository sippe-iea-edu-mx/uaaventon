/* =========================================================
   UAAVENTÓN
   BUSCAR VIAJES PUBLICADOS
========================================================= */

const SEARCH_TRIPS_STORAGE_KEY =
    "uaaventon_trips";


/* =========================================================
   ELEMENTOS
========================================================= */

const publishedTripsList =
    document.getElementById(
        "publishedTripsList"
    );

const searchPageForm =
    document.getElementById(
        "searchPageForm"
    );

const searchOrigin =
    document.getElementById(
        "searchOrigin"
    );

const searchDestination =
    document.getElementById(
        "searchDestination"
    );

const searchDate =
    document.getElementById(
        "searchDate"
    );

const priceFilter =
    document.getElementById(
        "priceFilter"
    );

const priceValue =
    document.getElementById(
        "priceValue"
    );

const seatsFilter =
    document.getElementById(
        "seatsFilter"
    );

const sortTrips =
    document.getElementById(
        "sortTrips"
    );

const resultsCount =
    document.getElementById(
        "resultsCount"
    );

const resultsDescription =
    document.getElementById(
        "resultsDescription"
    );

const noResults =
    document.getElementById(
        "noResults"
    );

const clearFilters =
    document.getElementById(
        "clearFilters"
    );

const resetSearchFilters =
    document.getElementById(
        "resetSearchFilters"
    );


/* =========================================================
   OBTENER VIAJES
========================================================= */

function getSearchTrips() {

    try {

        const stored =
            localStorage.getItem(
                SEARCH_TRIPS_STORAGE_KEY
            );

        return stored
            ? JSON.parse(stored)
            : [];

    } catch (error) {

        console.error(
            "No fue posible cargar los viajes:",
            error
        );

        return [];

    }

}


/* =========================================================
   NORMALIZAR TEXTO
========================================================= */

function normalizeSearchText(text) {

    return String(text || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

}


/* =========================================================
   INICIALES
========================================================= */

function getSearchInitials(name) {

    if (!name) return "UA";

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word =>
            word.charAt(0).toUpperCase()
        )
        .join("");

}


/* =========================================================
   ETIQUETA DE FECHA
========================================================= */

function getSearchDateLabel(dateValue) {

    if (!dateValue) {
        return "";
    }


    const tripDate =
        new Date(
            `${dateValue}T12:00:00`
        );


    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const tomorrow =
        new Date(today);

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    const comparableTripDate =
        new Date(tripDate);

    comparableTripDate.setHours(
        0,
        0,
        0,
        0
    );


    if (
        comparableTripDate.getTime() ===
        today.getTime()
    ) {

        return "HOY";

    }


    if (
        comparableTripDate.getTime() ===
        tomorrow.getTime()
    ) {

        return "MAÑANA";

    }


    return new Intl.DateTimeFormat(
        "es-MX",
        {
            day: "numeric",
            month: "short"
        }
    )
        .format(tripDate)
        .toUpperCase();

}


/* =========================================================
   NÚMERO DE VIAJES DEL CONDUCTOR
========================================================= */

function getDriverTripCount(
    driverId
) {

    return getSearchTrips()
        .filter(trip =>

            trip.role === "driver" &&

            trip.driverId ===
                driverId

        )
        .length;

}


/* =========================================================
   VIAJES DISPONIBLES
========================================================= */

function getAvailableDriverTrips() {

    const trips =
        getSearchTrips();


    return trips.filter(trip => {

        /*
           Solo publicaciones de conductor.
        */

        if (trip.role !== "driver") {
            return false;
        }


        /*
           No mostrar finalizados ni cancelados.
        */

        if (
            trip.status === "finished" ||
            trip.status === "cancelled"
        ) {

            return false;

        }


        /*
           Un viaje iniciado tampoco debe aceptar
           pasajeros nuevos.
        */

        if (trip.status === "in_progress") {
            return false;
        }


        const availableSeats =
            Number(
                trip.availableSeats ??
                trip.seats ??
                0
            );


        /*
           Ocultar viajes llenos.
        */

        if (availableSeats <= 0) {
            return false;
        }


        return true;

    });

}


/* =========================================================
   CREAR TARJETA
========================================================= */

function createPublishedTripCard(
    trip
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "search-trip-card";


    const availableSeats =
        Number(
            trip.availableSeats ??
            trip.seats ??
            0
        );


    const hour =
        Number(
            String(
                trip.time || "0:00"
            ).split(":")[0]
        );


    article.dataset.price =
        trip.price;

    article.dataset.seats =
        availableSeats;

    article.dataset.hour =
        hour;

    article.dataset.destination =
        normalizeSearchText(
            trip.destination
        );

    article.dataset.origin =
        normalizeSearchText(
            trip.origin
        );

    article.dataset.date =
        trip.date || "";


    const driverTrips =
        getDriverTripCount(
            trip.driverId
        );


    article.innerHTML = `

        <div class="search-trip-main">

            <div class="search-trip-route">

                <div class="search-route-time">

                    <strong>
                        ${trip.time || "--:--"}
                    </strong>

                    <span>
                        ${getSearchDateLabel(trip.date)}
                    </span>

                </div>


                <div class="search-route-visual">

                    <span class="search-origin-point"></span>

                    <div></div>

                    <span class="search-destination-point"></span>

                </div>


                <div class="search-route-locations">

                    <div>

                        <small>ORIGEN</small>

                        <strong>
                            ${trip.origin}
                        </strong>

                        <span>
                            Universidad Autónoma de Aguascalientes
                        </span>

                    </div>


                    <div>

                        <small>DESTINO FINAL</small>

                        <strong>
                            ${trip.destination}
                        </strong>

                        <span>
                            Destino del viaje
                        </span>

                    </div>

                </div>

            </div>


            <div class="search-trip-price">

                <span>
                    POR PERSONA
                </span>

                <strong>
                    $${trip.price}
                </strong>

            </div>

        </div>


        <div class="search-trip-middle">

            <div class="search-driver">

                <div class="trip-avatar">

                    ${getSearchInitials(
                        trip.driverName
                    )}

                </div>


                <div>

                    <strong>
                        ${trip.driverName || "Estudiante UAA"}
                    </strong>

                    <span>

                    <span>

                        <i class="fa-solid fa-route"></i>

                        <small>
                            ${driverTrips}
                            ${
                                driverTrips === 1
                                    ? "viaje publicado"
                                    : "viajes publicados"
                            }
                        </small>

                    </span>


                </div>

            </div>


            <div class="search-trip-tags">

                <span>

                    <i class="fa-solid fa-car"></i>

                    ${trip.vehicle || "Vehículo"}

                </span>


                <span>

                    <i class="fa-solid fa-user-group"></i>

                    ${availableSeats}

                    ${
                        availableSeats === 1
                            ? "lugar"
                            : "lugares"
                    }

                </span>

            </div>

        </div>


        <div class="search-trip-footer">

            <div class="route-match">

                <i class="fa-solid fa-route"></i>

                <span>
                    Puedes bajar en puntos intermedios
                </span>

            </div>


            <a
                href="viaje.html?id=${encodeURIComponent(trip.id)}"
                class="btn btn-primary"
            >

                Ver viaje

                <i class="fa-solid fa-arrow-right"></i>

            </a>

        </div>

    `;


    return article;

}


/* =========================================================
   FILTRAR VIAJES
========================================================= */

function getFilteredSearchTrips() {

    let trips =
        getAvailableDriverTrips();


    const originValue =
        normalizeSearchText(
            searchOrigin
                ? searchOrigin.value
                : ""
        );


    const destinationValue =
        normalizeSearchText(
            searchDestination
                ? searchDestination.value
                : ""
        );


    const dateValue =
        searchDate
            ? searchDate.value
            : "";


    const maxPrice =
        priceFilter
            ? Number(priceFilter.value)
            : Infinity;


    const minSeats =
        seatsFilter
            ? Number(seatsFilter.value)
            : 1;


    const selectedTime =
        document.querySelector(
            'input[name="timeFilter"]:checked'
        );


    const timeValue =
        selectedTime
            ? selectedTime.value
            : "all";


    trips =
        trips.filter(trip => {

            const tripOrigin =
                normalizeSearchText(
                    trip.origin
                );


            const tripDestination =
                normalizeSearchText(
                    trip.destination
                );


            const availableSeats =
                Number(
                    trip.availableSeats ??
                    trip.seats ??
                    0
                );


            const hour =
                Number(
                    String(
                        trip.time || "0:00"
                    ).split(":")[0]
                );


            const matchesOrigin =
                !originValue ||
                tripOrigin ===
                    originValue;


            /*
               Permite buscar "Jesus" y encontrar
               "Jesús María".
            */

            const matchesDestination =
                !destinationValue ||
                tripDestination.includes(
                    destinationValue
                );


            const matchesDate =
                !dateValue ||
                trip.date ===
                    dateValue;


            const matchesPrice =
                Number(trip.price) <=
                    maxPrice;


            const matchesSeats =
                availableSeats >=
                    minSeats;


            let matchesTime =
                true;


            if (timeValue === "morning") {

                matchesTime =
                    hour >= 6 &&
                    hour < 12;

            }


            if (timeValue === "afternoon") {

                matchesTime =
                    hour >= 12 &&
                    hour < 18;

            }


            if (timeValue === "night") {

                matchesTime =
                    hour >= 18 &&
                    hour <= 23;

            }


            return (
                matchesOrigin &&
                matchesDestination &&
                matchesDate &&
                matchesPrice &&
                matchesSeats &&
                matchesTime
            );

        });


    /* =====================================================
       ORDENAR
    ====================================================== */

    const sortValue =
        sortTrips
            ? sortTrips.value
            : "recommended";


    if (sortValue === "price") {

        trips.sort(
            (a, b) =>
                Number(a.price) -
                Number(b.price)
        );

    }


    if (sortValue === "time") {

        trips.sort(
            (a, b) => {

                const aDate =
                    `${a.date || ""}T${a.time || "00:00"}`;

                const bDate =
                    `${b.date || ""}T${b.time || "00:00"}`;


                return aDate.localeCompare(
                    bDate
                );

            }
        );

    }


    return trips;

}


/* =========================================================
   RENDER
========================================================= */

function renderPublishedTrips() {

    if (!publishedTripsList) {
        return;
    }


    const trips =
        getFilteredSearchTrips();


    publishedTripsList.innerHTML =
        "";


    trips.forEach(trip => {

        publishedTripsList.appendChild(
            createPublishedTripCard(
                trip
            )
        );

    });


    if (resultsCount) {

        resultsCount.textContent =
            `${trips.length} ${
                trips.length === 1
                    ? "viaje encontrado"
                    : "viajes encontrados"
            }`;

    }


    if (resultsDescription) {

        const destination =
            searchDestination
                ? searchDestination.value.trim()
                : "";


        resultsDescription.textContent =
            destination
                ? `Viajes disponibles hacia ${destination}.`
                : "Viajes publicados por estudiantes de la UAA.";

    }


    if (noResults) {

        noResults.style.display =
            trips.length === 0
                ? "block"
                : "none";

    }

}


/* =========================================================
   URL DEL DASHBOARD
========================================================= */

function loadSearchFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const origin =
        params.get("origin");


    const destination =
        params.get("destination");


    const date =
        params.get("date");


    if (
        origin &&
        searchOrigin
    ) {

        searchOrigin.value =
            origin;

    }


    if (
        destination &&
        searchDestination
    ) {

        searchDestination.value =
            destination;

    }


    if (
        date &&
        searchDate
    ) {

        searchDate.value =
            date;

    }

}


/* =========================================================
   BUSCADOR
========================================================= */

if (searchPageForm) {

    searchPageForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const params =
                new URLSearchParams();


            if (
                searchOrigin &&
                searchOrigin.value
            ) {

                params.set(
                    "origin",
                    searchOrigin.value
                );

            }


            if (
                searchDestination &&
                searchDestination.value.trim()
            ) {

                params.set(
                    "destination",
                    searchDestination.value.trim()
                );

            }


            if (
                searchDate &&
                searchDate.value
            ) {

                params.set(
                    "date",
                    searchDate.value
                );

            }


            const query =
                params.toString();


            const newURL =
                query
                    ? `buscar.html?${query}`
                    : "buscar.html";


            history.replaceState(
                {},
                "",
                newURL
            );


            renderPublishedTrips();

        }
    );

}


/* =========================================================
   FILTROS
========================================================= */

if (priceFilter) {

    priceFilter.addEventListener(
        "input",
        () => {

            if (priceValue) {

                priceValue.textContent =
                    `$${priceFilter.value}`;

            }


            renderPublishedTrips();

        }
    );

}


if (seatsFilter) {

    seatsFilter.addEventListener(
        "change",
        renderPublishedTrips
    );

}


document
    .querySelectorAll(
        'input[name="timeFilter"]'
    )
    .forEach(input => {

        input.addEventListener(
            "change",
            renderPublishedTrips
        );

    });


if (sortTrips) {

    sortTrips.addEventListener(
        "change",
        renderPublishedTrips
    );

}


/* =========================================================
   LIMPIAR FILTROS
========================================================= */

function resetDynamicSearchFilters() {

    document
        .querySelectorAll(
            'input[name="timeFilter"]'
        )
        .forEach(input => {

            input.checked =
                input.value === "all";

        });


    if (priceFilter) {

        priceFilter.value =
            "100";

    }


    if (priceValue) {

        priceValue.textContent =
            "$100";

    }


    if (seatsFilter) {

        seatsFilter.value =
            "1";

    }


    renderPublishedTrips();

}


if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        resetDynamicSearchFilters
    );

}


if (resetSearchFilters) {

    resetSearchFilters.addEventListener(
        "click",
        resetDynamicSearchFilters
    );

}


/* =========================================================
   FECHA MÍNIMA
========================================================= */

if (searchDate) {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    searchDate.min =
        `${year}-${month}-${day}`;

}


/* =========================================================
   ACTUALIZACIÓN ENTRE PESTAÑAS
========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            SEARCH_TRIPS_STORAGE_KEY
        ) {

            renderPublishedTrips();

        }

    }
);


/* =========================================================
   INICIALIZAR
========================================================= */

loadSearchFromURL();

renderPublishedTrips();