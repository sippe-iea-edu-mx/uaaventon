/* =========================================================
   UAAVENTÓN
   MIS VIAJES
========================================================= */

const MY_TRIPS_STORAGE_KEY =
    "uaaventon_trips";

const MY_TRIPS_USER_KEY =
    "uaaventonUser";


let selectedManagedTripId =
    null;


/* =========================================================
   OBTENER VIAJES
========================================================= */

function getMyTrips() {

    try {

        const stored =
            localStorage.getItem(
                MY_TRIPS_STORAGE_KEY
            );


        return stored
            ? JSON.parse(stored)
            : [];

    } catch (error) {

        console.error(
            "No fue posible leer los viajes:",
            error
        );

        return [];

    }

}


/* =========================================================
   GUARDAR
========================================================= */

function saveMyTrips(trips) {

    localStorage.setItem(
        MY_TRIPS_STORAGE_KEY,
        JSON.stringify(trips)
    );

}

/* =========================================================
   USUARIO ACTUAL Y PROPIEDAD DE VIAJES
========================================================= */

function getMyTripsCurrentUser() {

    try {

        const stored =
            localStorage.getItem(
                MY_TRIPS_USER_KEY
            );

        if (!stored) {
            return null;
        }

        const user =
            JSON.parse(stored);

        const id =
            user.universityId ||
            user.id ||
            null;

        const fullName =
            `${user.name || ""} ${user.lastName || ""}`
                .replace(/\s+/g, " ")
                .trim();

        return {
            id,
            fullName
        };

    } catch (error) {

        console.error(
            "No fue posible obtener el usuario actual:",
            error
        );

        return null;
    }
}


function tripBelongsToCurrentUser(trip) {

    const user =
        getMyTripsCurrentUser();

    if (!user || !user.id || !trip) {
        return false;
    }

    if (trip.role === "driver") {

        return String(trip.driverId || "") ===
            String(user.id);
    }

    if (trip.role === "passenger") {

        return String(trip.passengerId || "") ===
            String(user.id);
    }

    return false;
}


function getCurrentUserTrips() {

    return getMyTrips()
        .filter(
            trip =>
                tripBelongsToCurrentUser(trip)
        );
}

/* =========================================================
   FORMATO FECHA
========================================================= */

function formatMyTripDate(dateValue) {

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
            weekday: "short",
            day: "numeric",
            month: "short"
        }
    ).format(date);

}


/* =========================================================
   DETERMINAR CATEGORÍA
========================================================= */

    function getTripCategory(trip) {

        if (trip.status === "finished") {

            return "finished";

        }


        if (trip.status === "cancelled") {

            return "cancelled";

        }


        if (trip.status === "in_progress") {

            return "active";

        }


        return "upcoming";

    }

/* =========================================================
   NOMBRE DEL VEHÍCULO
========================================================= */

function getMyTripVehicleName(trip) {

    if (!trip) {
        return "Vehículo registrado";
    }


    if (
        trip.vehicleInfo &&
        typeof trip.vehicleInfo === "object"
    ) {

        const vehicleName =
            `${trip.vehicleInfo.brand || ""} ${trip.vehicleInfo.model || ""}`
                .replace(/\s+/g, " ")
                .trim();


        if (vehicleName) {
            return vehicleName;
        }

    }


    if (trip.vehicle) {
        return trip.vehicle;
    }


    return "Vehículo registrado";

}

/* =========================================================
   CREAR TARJETA
========================================================= */

function createMyTripCard(trip) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "my-trip-card";


    if (trip.status === "in_progress") {

        article.classList.add(
            "trip-in-progress"
        );

    }


    if (
        trip.status === "finished" ||
        trip.status === "cancelled"
    ) {

        article.classList.add(
            "trip-completed"
        );

    }


    const isDriver =
        trip.role === "driver";

        const pendingRequests =
            isDriver &&
            Array.isArray(trip.requests)
                ? trip.requests.filter(
                    request =>
                        request.status === "pending"
                ).length
                : 0;

        let passengerRequestText =
    "Solicitud pendiente";

let passengerRequestIcon =
    "fa-regular fa-clock";

let passengerRequestClass =
    "pending";


if (trip.requestStatus === "accepted") {

    passengerRequestText =
        "Solicitud aceptada";

    passengerRequestIcon =
        "fa-solid fa-circle-check";

    passengerRequestClass =
        "accepted";

}


if (trip.requestStatus === "rejected") {

    passengerRequestText =
        "Solicitud rechazada";

    passengerRequestIcon =
        "fa-solid fa-circle-xmark";

    passengerRequestClass =
        "rejected";

}


    let statusText =
        "Próximo";


    let statusClass =
        "upcoming";


    if (trip.status === "in_progress") {

        statusText =
            "En camino";

        statusClass =
            "active";

    }


    if (trip.status === "finished") {

        statusText =
            "Finalizado";

        statusClass =
            "finished";

    }


    if (trip.status === "cancelled") {

        statusText =
            "Cancelado";

        statusClass =
            "cancelled";

    }


    article.innerHTML = `

        <div class="my-trip-card-top">

            <div class="my-trip-role ${isDriver ? "driver" : "passenger"}">

                <i class="fa-solid ${
                    isDriver
                        ? "fa-car-side"
                        : "fa-user"
                }"></i>

                <span>
                    ${
                        isDriver
                            ? "Conduces tú"
                            : "Vas como pasajero"
                    }
                </span>

            </div>


            <div class="my-trip-status ${statusClass}">

                <span></span>

                ${statusText}

            </div>

        </div>


        <div class="my-trip-main">

            <div class="my-trip-date">

                <span>
                    ${formatMyTripDate(trip.date)}
                </span>

                <strong>
                    ${trip.time || "Sin hora"}
                </strong>

            </div>


            <div class="my-trip-route">

                <div class="my-trip-route-line">

                    <span></span>
                    <div></div>
                    <span></span>

                </div>


                <div class="my-trip-route-info">

                    <div>

                        <small>ORIGEN</small>

                        <strong>
                            ${trip.origin || "Sin origen"}
                        </strong>

                    </div>


                    <div>

                        <small>DESTINO</small>

                        <strong>
                            ${trip.destination || "Sin destino"}
                        </strong>

                    </div>

                </div>

            </div>


            <div class="my-trip-price">

                <small>
                    POR PERSONA
                </small>

                <strong>
                    ${trip.price !== undefined && trip.price !== null
                        ? `$${trip.price}`
                        : "Sin precio"}
                </strong>

            </div>

        </div>

        <div class="my-trip-details">

            <div>

                <i class="fa-solid fa-car"></i>

                <span>
                    ${getMyTripVehicleName(trip)}
                </span>

            </div>


            ${
                trip.status === "cancelled"
                    ? `
                        <div class="passenger-request-status rejected">

                            <i class="fa-solid fa-ban"></i>

                            <span>
                                Viaje cancelado
                            </span>

                        </div>
                    `

                    : trip.status === "finished"
                        ? `
                            <div class="passenger-request-status accepted">

                                <i class="fa-solid fa-circle-check"></i>

                                <span>
                                    Viaje finalizado
                                </span>

                            </div>
                        `
                    : `
                        <div>

                            <i class="fa-solid fa-user-group"></i>

                            <span>
                                ${
                                    trip.availableSeats ??
                                    trip.seats ??
                                    0
                                }
                                ${
                                    (
                                        trip.availableSeats ??
                                        trip.seats ??
                                        0
                                    ) === 1
                                        ? "lugar"
                                        : "lugares"
                                }
                            </span>

                        </div>


                        ${
                            isDriver
                                ? `
                                    <div>

                                        <i class="fa-regular fa-bell"></i>

                                        <span>
                                            ${pendingRequests}
                                            ${
                                                pendingRequests === 1
                                                    ? "solicitud pendiente"
                                                    : "solicitudes pendientes"
                                            }
                                        </span>

                                    </div>
                                `
                                : `
                                    <div class="passenger-request-status ${passengerRequestClass}">

                                        <i class="${passengerRequestIcon}"></i>

                                        <span>
                                            ${passengerRequestText}
                                        </span>

                                    </div>
                                `
                        }
                    `
            }

        </div>               


        <div class="my-trip-card-footer">

            <div class="my-trip-id">

                <span>
                    ID ${trip.id}
                </span>

            </div>


            ${
                trip.status === "finished" ||
                trip.status === "cancelled"

                    ? `
                        <button
                            type="button"
                            class="my-trip-history-button"
                            data-trip-id="${trip.id}"
                        >
                            Ver detalles

                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    `

                    : `
                        <button
                            type="button"
                            class="btn my-trip-manage-button"
                            data-trip-id="${trip.id}"
                        >
                            ${
                                isDriver
                                    ? "Administrar"
                                    : "Ver viaje"
                            }

                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    `
            }

        </div>

    `;


    return article;

}


/* =========================================================
   RENDER
========================================================= */

function renderMyTrips() {

    const trips =
        getCurrentUserTrips();


    const upcoming =
        trips.filter(
            trip =>
                getTripCategory(trip) ===
                "upcoming"
        );


    const active =
        trips.filter(
            trip =>
                getTripCategory(trip) ===
                "active"
        );


    const finished =
        trips.filter(
            trip =>
                getTripCategory(trip) ===
                "finished"
        );

    const cancelled =
    trips.filter(
        trip =>
            getTripCategory(trip) ===
            "cancelled"
    );

    renderTripGroup(
        "upcomingTripsList",
        "upcomingEmpty",
        upcoming
    );


    renderTripGroup(
        "activeTripsList",
        "activeEmpty",
        active
    );


    renderTripGroup(
        "finishedTripsList",
        "finishedEmpty",
        finished
    );

    renderTripGroup(
    "cancelledTripsList",
    "cancelledEmpty",
    cancelled
    );

    updateMyTripCounters(
        upcoming.length,
        active.length,
        finished.length,
        cancelled.length
    );

    attachTripButtons();

}


/* =========================================================
   RENDER GRUPO
========================================================= */

function renderTripGroup(
    listId,
    emptyId,
    trips
) {

    const list =
        document.getElementById(
            listId
        );


    const empty =
        document.getElementById(
            emptyId
        );


    if (!list) return;


    list.innerHTML = "";


    if (trips.length === 0) {

        if (empty) {

            empty.style.display =
                "block";

        }

        return;

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    trips.forEach(
        trip => {

            list.appendChild(
                createMyTripCard(
                    trip
                )
            );

        }
    );

}


/* =========================================================
   CONTADORES
========================================================= */

function updateMyTripCounters(
    upcoming,
    active,
    finished,
    cancelled
) {

    const counters = {

        upcomingTripsCount:
            upcoming,

        activeTripsCount:
            active,

        finishedTripsCount:
            finished,

        cancelledTripsCount:
            cancelled,

        upcomingTabCount:
            upcoming,

        activeTabCount:
            active,

        finishedTabCount:
            finished,

        cancelledTabCount:
            cancelled

    };


    Object.entries(
        counters
    ).forEach(
        ([id, value]) => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.textContent =
                    value;

            }

        }
    );

}


/* =========================================================
   TABS
========================================================= */

const myTripsTabs =
    document.querySelectorAll(
        ".my-trips-tab"
    );


myTripsTabs.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const selectedTab =
                    button.dataset.tab;


                myTripsTabs.forEach(
                    tab => {

                        tab.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                document
                    .querySelectorAll(
                        ".my-trips-content"
                    )
                    .forEach(content => {

                        content.classList.toggle(
                            "active",
                            content.dataset.content ===
                            selectedTab
                        );

                    });

            }
        );

    }
);


/* =========================================================
   MODAL ADMINISTRAR
========================================================= */

const manageTripModal =
    document.getElementById(
        "manageTripModal"
    );


function openManageTrip(
    tripId
) {

    const trips =
        getCurrentUserTrips();


    const trip =
        trips.find(
            item =>
                item.id === tripId
        );


    if (!trip) return;


/*
   Si somos pasajeros, no abrimos
   las herramientas del conductor.
*/

if (trip.role === "passenger") {

    if (trip.sourceTripId) {

        window.location.href =
            `viaje.html?id=${encodeURIComponent(trip.sourceTripId)}`;

    }

    return;
}


selectedManagedTripId =
    trip.id;

renderTripRequests(trip);

    const manageTripEyebrow =
    document.getElementById(
        "manageTripEyebrow"
    );

    const manageTripDescription =
        document.getElementById(
            "manageTripDescription"
        );


    if (trip.status === "finished") {

        manageTripEyebrow.textContent =
            "DETALLES DEL VIAJE";

        manageTripDescription.textContent =
            "Consulta la información de este trayecto finalizado.";

    } else if (trip.status === "cancelled") {

        manageTripEyebrow.textContent =
            "DETALLES DEL VIAJE";

        manageTripDescription.textContent =
            "Consulta la información de este trayecto cancelado.";

    } else {

        manageTripEyebrow.textContent =
            "ADMINISTRAR VIAJE";

        manageTripDescription.textContent =
            "Consulta la información y administra el estado de este trayecto.";

    }


    document.getElementById(
        "manageTripTitle"
    ).textContent =
        `${trip.origin} → ${trip.destination}`;


    document.getElementById(
        "manageTripDate"
    ).textContent =
        formatMyTripDate(
            trip.date
        );


    document.getElementById(
        "manageTripTime"
    ).textContent =
        trip.time;

    
    const manageTripSeatsLabel =
        document.getElementById(
            "manageTripSeatsLabel"
        );


    const manageTripSeatsElement =
        document.getElementById(
            "manageTripSeats"
        );


    if (trip.status === "finished") {

        const acceptedPassengers =
            Array.isArray(trip.requests)
                ? trip.requests.filter(
                    request =>
                        request.status === "accepted"
                ).length
                : 0;


        manageTripSeatsLabel.textContent =
            "PASAJEROS";


        manageTripSeatsElement.textContent =
            acceptedPassengers;

    } else {

        const availableSeats =
            trip.availableSeats ??
            trip.seats ??
            0;


        manageTripSeatsLabel.textContent =
            "LUGARES";


        manageTripSeatsElement.textContent =
            `${availableSeats} ${
                availableSeats === 1
                    ? "lugar"
                    : "lugares"
            }`;

    }  



    document.getElementById(
        "manageTripPrice"
    ).textContent =
        trip.price !== undefined &&
        trip.price !== null
            ? `$${trip.price}`
            : "Sin precio";


    const startButton =
        document.getElementById(
            "startTripButton"
        );


    const finishButton =
        document.getElementById(
            "finishTripButton"
        );


    const cancelButton =
        document.getElementById(
            "cancelTripButton"
        );


    if (trip.status === "in_progress") {

        startButton.style.display =
            "none";

        finishButton.style.display =
            "flex";

        cancelButton.style.display =
            "none";

    } else if (
        trip.status === "finished" ||
        trip.status === "cancelled"
    ) {

        startButton.style.display =
            "none";

        finishButton.style.display =
            "none";

        cancelButton.style.display =
            "none";

    } else {

        startButton.style.display =
            "flex";

        finishButton.style.display =
            "none";

        cancelButton.style.display =
            "block";

    }


    manageTripModal.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   BOTONES DE TARJETAS
========================================================= */

function attachTripButtons() {

    document
        .querySelectorAll(
            ".my-trip-manage-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openManageTrip(
                        button.dataset.tripId
                    );

                }
            );

        });


    document
        .querySelectorAll(
            ".my-trip-history-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openManageTrip(
                        button.dataset.tripId
                    );

                }
            );

        });

}


/* =========================================================
   CERRAR MODAL
========================================================= */

function closeManageTripModal() {

    if (!manageTripModal) return;


    manageTripModal.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";

}


const closeManageTrip =
    document.getElementById(
        "closeManageTrip"
    );


if (closeManageTrip) {

    closeManageTrip.addEventListener(
        "click",
        closeManageTripModal
    );

}


if (manageTripModal) {

    const overlay =
        manageTripModal.querySelector(
            ".vehicle-modal-overlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeManageTripModal
        );

    }

}


/* =========================================================
   CAMBIAR ESTADO
========================================================= */

function changeManagedTripStatus(
    newStatus
) {

    if (!selectedManagedTripId) {
        return;
    }


    const trips =
        getMyTrips();


    const tripIndex =
        trips.findIndex(
            trip =>
                trip.id ===
                selectedManagedTripId
        );


    if (tripIndex === -1) {
        return;
    }


    /*
    Seguridad:
    solo el dueño puede modificar el viaje.
    */

    if (!tripBelongsToCurrentUser(trips[tripIndex])) {
        return;
    }


    trips[tripIndex].status =
        newStatus;


    saveMyTrips(
        trips
    );


    closeManageTripModal();


    renderMyTrips();


    if (newStatus === "in_progress") {

        activateTripsTab(
            "active"
        );

    }


    if (newStatus === "finished") {

        activateTripsTab(
            "finished"
        );

    }

}


/* =========================================================
   INICIAR
========================================================= */

const startTripButton =
    document.getElementById(
        "startTripButton"
    );


if (startTripButton) {

    startTripButton.addEventListener(
        "click",
        () => {

            changeManagedTripStatus(
                "in_progress"
            );

        }
    );

}


/* =========================================================
   FINALIZAR
========================================================= */

const finishTripButton =
    document.getElementById(
        "finishTripButton"
    );


if (finishTripButton) {

    finishTripButton.addEventListener(
        "click",
        () => {

            changeManagedTripStatus(
                "finished"
            );

        }
    );

}


/* =========================================================
   CANCELAR
========================================================= */

const cancelTripButton =
    document.getElementById(
        "cancelTripButton"
    );


const cancelTripModal =
    document.getElementById(
        "cancelTripModal"
    );


if (cancelTripButton) {

    cancelTripButton.addEventListener(
        "click",
        () => {

            closeManageTripModal();


            cancelTripModal.classList.add(
                "open"
            );


            document.body.style.overflow =
                "hidden";

        }
    );

}


/* =========================================================
   CONSERVAR VIAJE
========================================================= */

const keepTripButton =
    document.getElementById(
        "keepTripButton"
    );


function closeCancelTripModal() {

    if (!cancelTripModal) return;


    cancelTripModal.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";

}


if (keepTripButton) {

    keepTripButton.addEventListener(
        "click",
        closeCancelTripModal
    );

}


/* =========================================================
   CONFIRMAR CANCELACIÓN
========================================================= */

const confirmCancelTrip =
    document.getElementById(
        "confirmCancelTrip"
    );


if (confirmCancelTrip) {

    confirmCancelTrip.addEventListener(
        "click",
        () => {

            if (!selectedManagedTripId) {
                return;
            }


            const trips =
                getMyTrips();


            const index =
                trips.findIndex(
                    trip =>
                        trip.id ===
                        selectedManagedTripId
                );


            if (index === -1) {
                return;
            }


            if (!tripBelongsToCurrentUser(trips[index])) {
                return;
            }


            trips[index].status =
                "cancelled";


            const cancelledDriverTrip =
                trips[index];


            trips.forEach(
                trip => {

                    if (
                        trip.role === "passenger" &&
                        String(
                            trip.sourceTripId || ""
                        ) ===
                        String(
                            cancelledDriverTrip.id
                        )
                    ) {

                        trip.status =
                            "cancelled";


                        if (
                            typeof window.createNotification ===
                                "function" &&
                            trip.passengerId
                        ) {

                            window.createNotification({

                                userId:
                                    trip.passengerId,

                                type:
                                    "cancelled",

                                title:
                                    "Viaje cancelado",

                                message:
                                    `El viaje a ${cancelledDriverTrip.destination} fue cancelado por el conductor.`,

                                tripId:
                                    cancelledDriverTrip.id

                            });

                        }

                    }

                }
            );


            saveMyTrips(
                trips
            );


            closeCancelTripModal();


            renderMyTrips();


            window.history.replaceState(
                {},
                "",
                "mis-viajes.html?tab=cancelled"
            );


            activateTripsTab(
                "cancelled"
            );

        }
    );

}


/* =========================================================
   ACTIVAR TAB DESDE JS
========================================================= */

function activateTripsTab(
    tabName
) {

    myTripsTabs.forEach(
        tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.tab ===
                tabName
            );

        }
    );


    document
        .querySelectorAll(
            ".my-trips-content"
        )
        .forEach(content => {

            content.classList.toggle(
                "active",
                content.dataset.content ===
                tabName
            );

        });

}

/* =========================================================
   SOLICITUDES DE PASAJEROS
========================================================= */

function renderTripRequests(trip) {

    const container =
        document.getElementById(
            "manageTripRequests"
        );


    if (!container) return;


    /*
       Los pasajeros no administran solicitudes.
    */

    if (trip.role !== "driver") {

        container.innerHTML = "";

        container.style.display =
            "none";

        return;

    }


    container.style.display =
        "block";


    const requests =
        Array.isArray(trip.requests)
            ? trip.requests
            : [];


    if (requests.length === 0) {

        container.innerHTML = `

            <div class="manage-requests-heading">

                <div>
                    <small>SOLICITUDES</small>
                    <strong>Pasajeros</strong>
                </div>

                <span>0</span>

            </div>


            <div class="no-trip-requests">

                <i class="fa-regular fa-user"></i>

                <span>
                    ${
                        trip.status === "cancelled"
                            ? "Este viaje no tenía solicitudes al momento de ser cancelado."
                            : trip.status === "finished"
                                ? "Este viaje finalizó sin solicitudes de pasajeros."
                                : "Aún no hay solicitudes para este viaje."
                    }
                </span>

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <div class="manage-requests-heading">

            <div>
                <small>SOLICITUDES</small>
                <strong>Pasajeros</strong>
            </div>

            <span>
                ${requests.length}
            </span>

        </div>


        <div class="manage-request-list">

            ${requests.map(request => {

                let statusHTML = "";


                if (request.status === "accepted") {

                    statusHTML = `

                        <div class="request-decision accepted">

                            <i class="fa-solid fa-circle-check"></i>

                            Solicitud aceptada

                        </div>

                    `;

                } else if (
                    request.status === "rejected"
                ) {

                    statusHTML = `

                        <div class="request-decision rejected">

                            <i class="fa-solid fa-circle-xmark"></i>

                            Solicitud rechazada

                        </div>

                    `;

                } else {

                    statusHTML = `

                        <div class="request-actions">

                            <button
                                type="button"
                                class="request-reject-button"
                                data-request-id="${request.id}"
                            >
                                <i class="fa-solid fa-xmark"></i>
                            </button>


                            <button
                                type="button"
                                class="request-accept-button"
                                data-request-id="${request.id}"
                            >
                                <i class="fa-solid fa-check"></i>

                                Aceptar
                            </button>

                        </div>

                    `;

                }


                return `

                    <article class="manage-request-item">

                        <div class="request-passenger">

                            <div class="request-passenger-avatar">

                                ${getInitials(
                                    request.passengerName
                                )}

                            </div>


                            <div>

                                <strong>
                                    ${request.passengerName}
                                </strong>

                                <span>

                                    <i class="fa-solid fa-location-dot"></i>

                                    Baja en ${request.dropoff}

                                </span>

                            </div>

                        </div>


                        ${statusHTML}

                    </article>

                `;

            }).join("")}

        </div>

    `;


    attachRequestDecisionButtons();

}


/* =========================================================
   INICIALES
========================================================= */

function getInitials(name) {

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
   BOTONES ACEPTAR / RECHAZAR
========================================================= */

function attachRequestDecisionButtons() {

    document
        .querySelectorAll(
            ".request-accept-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    decidePassengerRequest(
                        button.dataset.requestId,
                        "accepted"
                    );

                }
            );

        });


    document
        .querySelectorAll(
            ".request-reject-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    decidePassengerRequest(
                        button.dataset.requestId,
                        "rejected"
                    );

                }
            );

        });

}


/* =========================================================
   DECIDIR SOLICITUD
========================================================= */

function decidePassengerRequest(
    requestId,
    decision
) {

    const trips =
        getMyTrips();


    const driverTrip =
        trips.find(trip =>
            trip.id ===
            selectedManagedTripId
        );


    if (!driverTrip) return;


    /*
    Solo el conductor propietario
    puede aceptar o rechazar pasajeros.
    */

    if (
        driverTrip.role !== "driver" ||
        !tripBelongsToCurrentUser(driverTrip)
    ) {
        return;
    }


    if (!Array.isArray(driverTrip.requests)) {
        return;
    }


    const request =
        driverTrip.requests.find(
            item =>
                item.id === requestId
        );


    if (!request) return;


    /*
       No permitir decidir dos veces.
    */

    if (request.status !== "pending") {
        return;
    }


    /* =====================================================
       VALIDAR LUGARES
    ====================================================== */

    if (decision === "accepted") {

        const availableSeats =
            Number(
                driverTrip.availableSeats ??
                driverTrip.seats ??
                0
            );


        if (availableSeats <= 0) {

            alert(
                "Este viaje ya no tiene lugares disponibles."
            );

            return;

        }


        driverTrip.availableSeats =
            availableSeats - 1;

    }


    /* =====================================================
       ACTUALIZAR SOLICITUD DEL CONDUCTOR
    ====================================================== */

    request.status =
        decision;


    /* =====================================================
       ACTUALIZAR VIAJE DEL PASAJERO
    ====================================================== */

    const passengerTrip =
        trips.find(trip =>

            trip.id ===
                request.passengerTripId ||

            trip.requestId ===
                request.id

        );


    if (passengerTrip) {

        passengerTrip.requestStatus =
            decision;


        if (decision === "rejected") {

            passengerTrip.status =
                "cancelled";

        }

    }


        saveMyTrips(trips);


    /* =====================================================
       NOTIFICAR AL PASAJERO
    ====================================================== */

    if (
        typeof window.createNotification ===
            "function"
    ) {

        if (decision === "accepted") {

            window.createNotification({

                userId:
                    request.passengerId,

                type:
                    "accepted",

                title:
                    "Solicitud aceptada",

                message:
                    `Tu solicitud para viajar a ${driverTrip.destination} fue aceptada.`,

                tripId:
                    driverTrip.id

            });

        }


        if (decision === "rejected") {

            window.createNotification({

                userId:
                    request.passengerId,

                type:
                    "rejected",

                title:
                    "Solicitud no aceptada",

                message:
                    `Tu solicitud para viajar a ${driverTrip.destination} no fue aceptada.`,

                tripId:
                    driverTrip.id

            });

        }

    }


    /*
       Volvemos a obtenerlo porque acabamos
       de modificar los datos.
    */

    const updatedTrip =
        getMyTrips().find(
            trip =>
                trip.id ===
                selectedManagedTripId
        );


    if (updatedTrip) {

        renderTripRequests(
            updatedTrip
        );


        const updatedAvailableSeats =
            updatedTrip.availableSeats ??
            updatedTrip.seats ??
            0;

        document.getElementById(
            "manageTripSeats"
        ).textContent =
            `${updatedAvailableSeats} ${
                updatedAvailableSeats === 1
                    ? "lugar"
                    : "lugares"
            }`;

    }


    renderMyTrips();

}

/* =========================================================
   ACTUALIZACIÓN ENTRE PESTAÑAS
========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key === MY_TRIPS_STORAGE_KEY ||
            event.key === MY_TRIPS_USER_KEY
        ) {

            selectedManagedTripId =
                null;

            closeManageTripModal();
            closeCancelTripModal();

            renderMyTrips();
        }

    }
);

/* =========================================================
   INICIALIZAR
========================================================= */

renderMyTrips();


const myTripsUrlParams =
    new URLSearchParams(
        window.location.search
    );


const requestedTab =
    myTripsUrlParams.get(
        "tab"
    );


const validTabs = [
    "upcoming",
    "active",
    "finished",
    "cancelled"
];


if (
    requestedTab &&
    validTabs.includes(
        requestedTab
    )
) {

    activateTripsTab(
        requestedTab
    );

}