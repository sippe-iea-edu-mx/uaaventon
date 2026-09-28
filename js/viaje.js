/* =========================================================
   UAAVENTÓN
   DETALLE DE VIAJE / SOLICITUDES
========================================================= */

const TRIPS_STORAGE_KEY = "uaaventon_trips";


/* =========================================================
   ELEMENTOS
========================================================= */

const dropoffPoint =
    document.getElementById("dropoffPoint");

const selectedDropoff =
    document.getElementById("selectedDropoff");

const requestSeatButton =
    document.getElementById("requestSeatButton");

const requestModal =
    document.getElementById("requestModal");

const closeRequestModal =
    document.getElementById("closeRequestModal");

const continueBrowsing =
    document.getElementById("continueBrowsing");

const modalDropoff =
    document.getElementById("modalDropoff");


/* =========================================================
   LOCAL STORAGE
========================================================= */

function getTrips() {

    try {

        const stored =
            localStorage.getItem(
                TRIPS_STORAGE_KEY
            );


        return stored
            ? JSON.parse(stored)
            : [];

    } catch (error) {

        console.error(
            "No se pudieron cargar los viajes:",
            error
        );


        return [];

    }

}


function saveTrips(trips) {

    localStorage.setItem(
        TRIPS_STORAGE_KEY,
        JSON.stringify(trips)
    );

}


/* =========================================================
   OBTENER ID DESDE LA URL
========================================================= */

function getRequestedTripId() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return params.get("id");

}


/* =========================================================
   OBTENER VIAJE REAL
========================================================= */

function getCurrentTripFromStorage() {

    const tripId =
        getRequestedTripId();


    if (!tripId) {

        return null;

    }


    return getTrips().find(
        trip =>

            trip.id === tripId &&

            trip.role === "driver"

    ) || null;

}


/* =========================================================
   VIAJE ACTUAL
========================================================= */

let CURRENT_TRIP =
    getCurrentTripFromStorage();


/* =========================================================
   USUARIO ACTUAL
========================================================= */

function getCurrentUser() {

    try {

        const stored =
            localStorage.getItem(
                "uaaventonUser"
            );


        if (stored) {

            const user =
                JSON.parse(stored);


            return {

                id:
                    user.universityId ||
                    user.id ||
                    "USER-001",

                name:
                    `${user.name || ""} ${user.lastName || ""}`.trim()
                    || "Estudiante UAA"

            };

        }

    } catch (error) {

        console.error(
            "No fue posible obtener al usuario:",
            error
        );

    }


    /*
       Usuario temporal para pruebas.
    */

    return {

        id:
            "PASSENGER-001",

        name:
            "Estudiante UAA"

    };

}


/* =========================================================
   INICIALES
========================================================= */

function getTripInitials(name) {

    if (!name) {

        return "UA";

    }


    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(
            word =>
                word.charAt(0).toUpperCase()
        )
        .join("");

}


/* =========================================================
   FORMATEAR FECHA
========================================================= */

function formatTripDetailDate(
    dateValue
) {

    if (!dateValue) {

        return "Sin fecha";

    }


    const date =
        new Date(
            `${dateValue}T12:00:00`
        );


    return new Intl.DateTimeFormat(
        "es-MX",
        {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    ).format(date);

}

/* =========================================================
   VIAJES PUBLICADOS POR EL CONDUCTOR
========================================================= */

function getTripDriverCount(driverId) {

    if (!driverId) {
        return 0;
    }

    return getTrips()
        .filter(trip =>

            trip.role === "driver" &&

            String(trip.driverId || "") ===
            String(driverId)

        )
        .length;

}

function getTripRoutePoints(trip) {

    if (!trip || !trip.route) {
        return [];
    }

    return String(trip.route)
        .split(/,|→|->|\n/)
        .map(point =>
            point.trim()
        )
        .filter(Boolean)
        .filter(point =>

            point.toLowerCase() !==
                String(
                    trip.origin || ""
                ).toLowerCase()

            &&

            point.toLowerCase() !==
                String(
                    trip.destination || ""
                ).toLowerCase()

        );

}

/* =========================================================
   CARGAR INFORMACIÓN REAL DEL VIAJE
========================================================= */

function loadRealTripDetail() {

    /*
       VIAJE NO ENCONTRADO
    */

    if (!CURRENT_TRIP) {

        showTripNotFound();

        return;

    }


    /* =====================================================
       TÍTULO
    ====================================================== */

    const title =
    document.querySelector(
        ".trip-detail-heading h1"
    );


    if (title) {

        title.innerHTML = `

            ${CURRENT_TRIP.origin}

            <i class="fa-solid fa-arrow-right"></i>

            ${CURRENT_TRIP.destination}

        `;

    }


    /* =====================================================
       PRECIO SUPERIOR
    ====================================================== */

    const headerPrice =
    document.querySelector(
        ".detail-price strong"
    );


    if (headerPrice) {

        headerPrice.textContent =
            `$${CURRENT_TRIP.price}`;

    }


    /* =====================================================
       FECHA / HORA DEL ENCABEZADO
    ====================================================== */

    const subtitle =
    document.querySelector(
        ".trip-detail-heading > div > p"
    );


    if (subtitle) {

        subtitle.innerHTML = `

            <i class="fa-regular fa-calendar"></i>

            ${formatTripDetailDate(
                CURRENT_TRIP.date
            )}

            ·

            ${CURRENT_TRIP.time || "--:--"}

        `;

    }


    /* =====================================================
       MAPA - ORIGEN
    ====================================================== */

    const mapOrigin =
    document.querySelector(
        ".marker-start strong"
    );


    if (mapOrigin) {

        mapOrigin.textContent =
            CURRENT_TRIP.origin;

    }


    /* =====================================================
       MAPA - DESTINO
    ====================================================== */

    const mapDestination =
    document.querySelector(
        ".marker-end strong"
    );


    if (mapDestination) {

        mapDestination.textContent =
            CURRENT_TRIP.destination;

    }

    /* =====================================================
   PUNTOS DE BAJADA DINÁMICOS
====================================================== */

if (dropoffPoint) {

    /*
       Limpiamos los puntos demostrativos.
    */

    dropoffPoint.innerHTML = `
        <option value="">
            Selecciona un punto
        </option>
    `;


    /*
       La ruta publicada puede contener puntos
       separados por comas, flechas o saltos de línea.
    */

    const routePoints =
    getTripRoutePoints(
        CURRENT_TRIP
    );

    /*
       Agregamos puntos intermedios.
    */

    routePoints.forEach(
        point => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                point;

            option.textContent =
                point;

            dropoffPoint.appendChild(
                option
            );

        }
    );


    /*
       El destino final siempre puede
       seleccionarse como bajada.
    */

    const destinationOption =
        document.createElement(
            "option"
        );


    destinationOption.value =
        CURRENT_TRIP.destination;

    destinationOption.textContent =
        CURRENT_TRIP.destination;


    dropoffPoint.appendChild(
        destinationOption
    );

}

/* =====================================================
   PUNTOS INTERMEDIOS DEL MAPA
====================================================== */

const dynamicPointsContainer =
    document.getElementById(
        "dynamicIntermediatePoints"
    );


if (dynamicPointsContainer) {

    const routePoints =
        getTripRoutePoints(
            CURRENT_TRIP
        );


    dynamicPointsContainer.innerHTML =
        "";


    const pointClasses = [
        "point-one",
        "point-two",
        "point-three"
    ];


    routePoints
        .slice(0, 3)
        .forEach(
            (point, index) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    `intermediate-map-point ${pointClasses[index]}`;


                button.dataset.dropoff =
                    point;


                button.innerHTML = `

                    <span></span>

                    <small>
                        ${point}
                    </small>

                `;


                button.addEventListener(
                    "click",
                    () => {

                        if (dropoffPoint) {

                            dropoffPoint.value =
                                point;

                        }


                        updateDropoffSelection(
                            point
                        );

                    }
                );


                dynamicPointsContainer.appendChild(
                    button
                );

            }
        );

}


    /* =====================================================
       INFORMACIÓN DE RUTA
    ====================================================== */

    const routeInfo =
    document.querySelectorAll(
        ".detail-route-info strong"
    );


    if (routeInfo.length >= 2) {

        routeInfo[0].textContent =
            CURRENT_TRIP.origin;


        routeInfo[
            routeInfo.length - 1
        ].textContent =
            CURRENT_TRIP.destination;

    }

    /*
   HORAS DEL TRAYECTO
*/

const routeTimes =
    document.querySelectorAll(
        ".detail-route-info .detail-time"
    );


if (routeTimes.length >= 1) {

    routeTimes[0].textContent =
        CURRENT_TRIP.time ||
        "--:--";

}


/*
   Como todavía no calculamos automáticamente
   la hora de llegada, evitamos mostrar la
   hora ficticia del viaje demostrativo.
*/

if (routeTimes.length >= 2) {

    routeTimes[1].textContent =
        "--:--";

}


    /* =====================================================
       INFORMACIÓN GENERAL
    ====================================================== */

    const infoItems =
    document.querySelectorAll(
        ".trip-detail-data > div"
    );


    infoItems.forEach(item => {

        const label =
            item.querySelector(
                "small"
            );


        const value =
            item.querySelector(
                "strong"
            );


        if (!label || !value) {

            return;

        }


        const labelText =
            label.textContent
                .trim()
                .toLowerCase();


        if (
            labelText.includes(
                "fecha"
            )
        ) {

            value.textContent =
                formatTripDetailDate(
                    CURRENT_TRIP.date
                );

        }


        if (
            labelText.includes(
                "hora"
            )
        ) {

            value.textContent =
                CURRENT_TRIP.time ||
                "--:--";

        }


        if (
            labelText.includes(
                "lugar"
            )
        ) {

            const seats =
                Number(
                    CURRENT_TRIP.availableSeats ??
                    CURRENT_TRIP.seats ??
                    0
                );


            value.textContent =
                `${seats} ${
                    seats === 1
                        ? "lugar"
                        : "lugares"
                }`;

        }


        if (
            labelText.includes(
                "costo"
            ) ||
            labelText.includes(
                "precio"
            )
        ) {

            value.textContent =
                `$${CURRENT_TRIP.price}`;

        }

    });


    /* =====================================================
       CONDUCTOR
    ====================================================== */

    const driverName =
    document.querySelector(
        ".driver-detail-info h3"
    );


    if (driverName) {

        driverName.textContent =
            CURRENT_TRIP.driverName ||
            "Estudiante UAA";

    }


    const driverAvatar =
        document.querySelector(
            ".driver-large-avatar"
        );


    if (driverAvatar) {

        driverAvatar.textContent =
            getTripInitials(
                CURRENT_TRIP.driverName
            );

    }

    const driverTripCount =
    document.getElementById(
        "driverTripCount"
    );


    if (driverTripCount) {

        const totalDriverTrips =
            getTripDriverCount(
                CURRENT_TRIP.driverId
            );


        driverTripCount.textContent =
            `${totalDriverTrips} ${
                totalDriverTrips === 1
                    ? "viaje publicado"
                    : "viajes publicados"
            }`;

    }


    /* =====================================================
       VEHÍCULO
    ====================================================== */

    const vehicleName =
    document.querySelector(
        ".vehicle-detail-name strong"
    );


    if (vehicleName) {

        vehicleName.textContent =
            CURRENT_TRIP.vehicle ||
            "Vehículo registrado";

    }


    /*
       Si tenemos el objeto completo del vehículo,
       intentamos actualizar sus datos.
    */

    if (
        CURRENT_TRIP.vehicleInfo &&
        typeof CURRENT_TRIP.vehicleInfo ===
            "object"
    ) {

        const vehicle =
            CURRENT_TRIP.vehicleInfo;

            const vehicleYear =
    document.querySelector(
        ".vehicle-detail-name span"
    );


const vehicleProperties =
    document.querySelectorAll(
        ".vehicle-property strong"
    );


if (vehicleYear) {

    vehicleYear.textContent =
        vehicle.year ||
        "—";

}


if (vehicleProperties[0]) {

    vehicleProperties[0].textContent =
        vehicle.color ||
        "—";

}


if (vehicleProperties[1]) {

    const plates =
        String(
            vehicle.plates || ""
        );

    vehicleProperties[1].textContent =
        plates.length > 4
            ? `***${plates.slice(-4)}`
            : plates || "—";

}


        if (vehicleName) {

            vehicleName.textContent =
                `${vehicle.brand || ""} ${vehicle.model || ""}`.trim()
                || CURRENT_TRIP.vehicle
                || "Vehículo registrado";

        }

    }


    /* =====================================================
       TARJETA DE RESERVACIÓN
    ====================================================== */

    const reservationRoute =
        document.querySelector(
            ".reservation-route"
        );


    if (reservationRoute) {

        const strongs =
            reservationRoute.querySelectorAll(
                "strong"
            );


        if (strongs[0]) {

            strongs[0].textContent =
                CURRENT_TRIP.origin;

        }


        if (strongs[1]) {

            strongs[1].textContent =
                CURRENT_TRIP.destination;

        }

    }

/*
   PRECIO EN RESUMEN
*/

const reservationPrice =
    document.querySelector(
        ".reservation-summary > div:first-child strong"
    );


if (reservationPrice) {

    reservationPrice.textContent =
        `$${CURRENT_TRIP.price}`;

}

    const reservationTotal =
        document.querySelector(
            ".reservation-total strong"
        );


    if (reservationTotal) {

        reservationTotal.textContent =
            `$${CURRENT_TRIP.price}`;

    }

    /* =====================================================
   MODAL DINÁMICO
====================================================== */

const modalDescription =
    document.querySelector(
        ".request-modal-card > p"
    );


if (modalDescription) {

    modalDescription.textContent =
        `${CURRENT_TRIP.driverName || "El conductor"} recibirá tu solicitud y podrá confirmarla antes del viaje.`;

}


const modalTripRoute =
    document.querySelector(
        ".modal-trip-summary > div:first-child strong"
    );


if (modalTripRoute) {

    modalTripRoute.textContent =
        `${CURRENT_TRIP.origin} → ${CURRENT_TRIP.destination}`;

}


    /* =====================================================
       VIAJE SIN LUGARES
    ====================================================== */

    const availableSeats =
        Number(
            CURRENT_TRIP.availableSeats ??
            CURRENT_TRIP.seats ??
            0
        );


    if (
        availableSeats <= 0 &&
        requestSeatButton
    ) {

        requestSeatButton.disabled =
            true;


        requestSeatButton.innerHTML = `

            <i class="fa-solid fa-user-group"></i>

            Viaje lleno

        `;

    }


    /* =====================================================
       ESTADO NO DISPONIBLE
    ====================================================== */

    if (
        CURRENT_TRIP.status ===
            "finished" ||

        CURRENT_TRIP.status ===
            "cancelled" ||

        CURRENT_TRIP.status ===
            "in_progress"
    ) {

        if (requestSeatButton) {

            requestSeatButton.disabled =
                true;


            requestSeatButton.innerHTML = `

                <i class="fa-solid fa-lock"></i>

                Viaje no disponible

            `;

        }

    }

}


/* =========================================================
   VIAJE NO ENCONTRADO
========================================================= */

function showTripNotFound() {

    const main =
        document.querySelector(
            ".trip-detail-page"
        );


    if (!main) {

        return;

    }


    main.innerHTML = `

        <div class="container">

            <div
                class="my-trips-empty"
                style="
                    display:block;
                    margin-top:60px;
                "
            >

                <div>

                    <i class="fa-solid fa-route"></i>

                </div>


                <h3>
                    Este viaje ya no está disponible
                </h3>


                <p>
                    Es posible que el viaje haya sido
                    cancelado, finalizado o que el enlace
                    ya no sea válido.
                </p>


                <a
                    href="buscar.html"
                    class="btn btn-primary"
                >

                    <i class="fa-solid fa-arrow-left"></i>

                    Buscar otro viaje

                </a>

            </div>

        </div>

    `;

}


/* =========================================================
   SELECCIONAR PUNTO DE BAJADA
========================================================= */

function updateDropoffSelection(
    value
) {

    if (!selectedDropoff) {

        return;

    }


    if (!value) {

        selectedDropoff.innerHTML = `

            <div>

                <i class="fa-solid fa-location-arrow"></i>

            </div>


            <span>
                Selecciona dónde quieres bajar.
            </span>

        `;


        document
            .querySelectorAll(
                ".intermediate-map-point"
            )
            .forEach(
                point => {

                    point.classList.remove(
                        "selected"
                    );

                }
            );


        return;

    }


    selectedDropoff.innerHTML = `

        <div>

            <i class="fa-solid fa-location-dot"></i>

        </div>


        <span>

            Bajarás en

            <strong>
                ${value}
            </strong>

        </span>

    `;


    document
        .querySelectorAll(
            ".intermediate-map-point"
        )
        .forEach(
            point => {

                point.classList.toggle(
                    "selected",
                    point.dataset.dropoff ===
                        value
                );

            }
        );

}


/* =========================================================
   SELECT
========================================================= */

if (dropoffPoint) {

    dropoffPoint.addEventListener(
        "change",
        () => {

            updateDropoffSelection(
                dropoffPoint.value
            );

        }
    );

}



/* =========================================================
   COMPROBAR SI YA SOLICITÓ
========================================================= */

function findExistingPassengerRequest() {

    /*
       Esta validación es importante.
       El archivo anterior intentaba usar
       CURRENT_TRIP.id incluso si el viaje
       no existía.
    */

    if (!CURRENT_TRIP) {

        return null;

    }


    const trips =
        getTrips();


    const user =
        getCurrentUser();


    return trips.find(
        trip =>

            trip.role ===
                "passenger" &&

            trip.sourceTripId ===
                CURRENT_TRIP.id &&

            trip.passengerId ===
                user.id &&

            trip.requestStatus !==
                "rejected" &&

            trip.status !==
                "cancelled"

    ) || null;

}


/* =========================================================
   ACTUALIZAR BOTÓN
========================================================= */

function updateRequestButton() {

    if (
        !requestSeatButton ||
        !CURRENT_TRIP
    ) {

        return;

    }


    /*
       Primero revisamos si el viaje
       todavía admite pasajeros.
    */

    const availableSeats =
        Number(
            CURRENT_TRIP.availableSeats ??
            CURRENT_TRIP.seats ??
            0
        );


    if (availableSeats <= 0) {

        requestSeatButton.disabled =
            true;


        requestSeatButton.innerHTML = `

            <i class="fa-solid fa-user-group"></i>

            Viaje lleno

        `;


        return;

    }


    if (
        CURRENT_TRIP.status ===
            "finished" ||

        CURRENT_TRIP.status ===
            "cancelled" ||

        CURRENT_TRIP.status ===
            "in_progress"
    ) {

        requestSeatButton.disabled =
            true;


        requestSeatButton.innerHTML = `

            <i class="fa-solid fa-lock"></i>

            Viaje no disponible

        `;


        return;

    }

    /*
   IMPEDIR SOLICITAR EL PROPIO VIAJE
*/

const currentUser =
    getCurrentUser();


if (
    String(CURRENT_TRIP.driverId || "") ===
    String(currentUser.id || "")
) {

    requestSeatButton.disabled =
        true;

    requestSeatButton.innerHTML = `

        <i class="fa-solid fa-car-side"></i>

        Este viaje es tuyo

    `;

    return;
}

    const existing =
        findExistingPassengerRequest();


    if (!existing) {

        requestSeatButton.disabled =
            false;


        requestSeatButton.innerHTML = `

            Solicitar lugar

            <i class="fa-solid fa-arrow-right"></i>

        `;


        return;

    }


    requestSeatButton.disabled =
        true;


    if (
        existing.requestStatus ===
            "accepted"
    ) {

        requestSeatButton.innerHTML = `

            <i class="fa-solid fa-circle-check"></i>

            Solicitud aceptada

        `;

    } else {

        requestSeatButton.innerHTML = `

            <i class="fa-regular fa-clock"></i>

            Solicitud pendiente

        `;

    }

}


/* =========================================================
   CREAR SOLICITUD
========================================================= */

function createSeatRequest() {

    /*
       VIAJE VÁLIDO
    */

    if (!CURRENT_TRIP) {

        alert(
            "Este viaje ya no está disponible."
        );


        return;

    }

    /*
   IMPEDIR SOLICITAR EL PROPIO VIAJE
*/

const currentUser =
    getCurrentUser();


if (
    String(CURRENT_TRIP.driverId || "") ===
    String(currentUser.id || "")
) {

    alert(
        "No puedes solicitar un lugar en un viaje que tú publicaste."
    );

    updateRequestButton();

    return;
}

    /*
       COMPROBAR ESTADO
    */

    if (
        CURRENT_TRIP.status ===
            "finished" ||

        CURRENT_TRIP.status ===
            "cancelled" ||

        CURRENT_TRIP.status ===
            "in_progress"
    ) {

        alert(
            "Este viaje ya no acepta solicitudes."
        );


        return;

    }


    /*
       COMPROBAR LUGARES
    */

    const availableSeats =
        Number(
            CURRENT_TRIP.availableSeats ??
            CURRENT_TRIP.seats ??
            0
        );


    if (availableSeats <= 0) {

        alert(
            "Este viaje ya no tiene lugares disponibles."
        );


        return;

    }


    /*
       PUNTO DE BAJADA
    */

    const selectedPoint =
        dropoffPoint
            ? dropoffPoint.value
            : "";


    if (!selectedPoint) {

        if (dropoffPoint) {

            dropoffPoint.focus();

        }


        updateDropoffSelection("");


        return;

    }


    /*
       EVITAR DUPLICADOS
    */

    const existing =
        findExistingPassengerRequest();


    if (existing) {

        alert(
            "Ya tienes una solicitud para este viaje."
        );


        return;

    }


    /*
       RECUPERAR DATOS ACTUALIZADOS
    */

    const trips =
        getTrips();


    const user =
        getCurrentUser();


    /*
       IMPORTANTE:
       Ahora buscamos exclusivamente por ID.
       Ya no usamos destino + hora.
    */

    const driverTrip =
        trips.find(
            trip =>

                trip.id ===
                    CURRENT_TRIP.id &&

                trip.role ===
                    "driver"
        );


    if (!driverTrip) {

        alert(
            "Este viaje ya no está disponible."
        );


        return;

    }


    const currentAvailableSeats =
        Number(
            driverTrip.availableSeats ??
            driverTrip.seats ??
            0
        );


    if (currentAvailableSeats <= 0) {

        alert(
            "Este viaje ya no tiene lugares disponibles."
        );


        CURRENT_TRIP =
            driverTrip;


        updateRequestButton();


        return;

    }


    const now =
        Date.now();


    const requestId =
        `REQ-${now}`;


    const passengerTripId =
        `PASS-${now}`;


    /* =====================================================
       REGISTRO DEL PASAJERO
    ====================================================== */

    const passengerTrip = {

        id:
            passengerTripId,

        role:
            "passenger",

        sourceTripId:
            driverTrip.id,

        passengerId:
            user.id,

        passengerName:
            user.name,

        driverId:
            driverTrip.driverId,

        driverName:
            driverTrip.driverName,

        origin:
            driverTrip.origin,

        destination:
            driverTrip.destination,

        route:
            driverTrip.route || "",

        dropoff:
            selectedPoint,

        date:
            driverTrip.date,

        time:
            driverTrip.time,

        price:
            Number(
                driverTrip.price
            ),

        vehicleId:
            driverTrip.vehicleId,

        vehicle:
            driverTrip.vehicle,

        seats:
            1,

        availableSeats:
            1,

        status:
            "upcoming",

        requestStatus:
            "pending",

        requestId:
            requestId,

        createdAt:
            new Date().toISOString()

    };


    /*
       Primero guardamos la representación
       del viaje para el pasajero.
    */

    trips.push(
        passengerTrip
    );


    /* =====================================================
       SOLICITUD EN EL VIAJE DEL CONDUCTOR
    ====================================================== */

    if (
        !Array.isArray(
            driverTrip.requests
        )
    ) {

        driverTrip.requests =
            [];

    }


    driverTrip.requests.push({

        id:
            requestId,

        passengerTripId:
            passengerTripId,

        passengerId:
            user.id,

        passengerName:
            user.name,

        dropoff:
            selectedPoint,

        status:
            "pending",

        createdAt:
            new Date().toISOString()

    });


    /* =====================================================
       GUARDAR
    ====================================================== */

    saveTrips(
        trips
    );

    /* =====================================================
       NOTIFICAR AL CONDUCTOR
    ====================================================== */

    if (
        typeof window.createNotification ===
            "function"
    ) {

        window.createNotification({

            userId:
                driverTrip.driverId,

            type:
                "request",

            title:
                "Nueva solicitud de viaje",

            message:
                `${user.name} solicitó un lugar en tu viaje a ${driverTrip.destination}.`,

            tripId:
                driverTrip.id

        });

    }

    /*
       Actualizamos la referencia local.
    */

    CURRENT_TRIP =
        getCurrentTripFromStorage();


    /* =====================================================
       MODAL
    ====================================================== */

    if (modalDropoff) {

        modalDropoff.textContent =
            selectedPoint;

    }


    if (requestModal) {

        requestModal.classList.add(
            "open"
        );


        document.body.style.overflow =
            "hidden";

    }


    updateRequestButton();

}


/* =========================================================
   BOTÓN SOLICITAR
========================================================= */

if (requestSeatButton) {

    requestSeatButton.addEventListener(
        "click",
        createSeatRequest
    );

}


/* =========================================================
   CERRAR MODAL
========================================================= */

function closeSeatRequestModal() {

    if (!requestModal) {

        return;

    }


    requestModal.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";

}


if (closeRequestModal) {

    closeRequestModal.addEventListener(
        "click",
        closeSeatRequestModal
    );

}


if (continueBrowsing) {

    continueBrowsing.addEventListener(
        "click",
        () => {

            window.location.href =
                "buscar.html";

        }
    );

}


if (requestModal) {

    const overlay =
        requestModal.querySelector(
            ".request-modal-overlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSeatRequestModal
        );

    }

}


/* =========================================================
   ACTUALIZAR SI CAMBIA LOCALSTORAGE
========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
                TRIPS_STORAGE_KEY
        ) {

            CURRENT_TRIP =
                getCurrentTripFromStorage();


            if (CURRENT_TRIP) {

                loadRealTripDetail();

                updateRequestButton();

            }

        }

    }
);


/* =========================================================
   INICIALIZAR
========================================================= */

loadRealTripDetail();


if (CURRENT_TRIP) {

    updateRequestButton();

}