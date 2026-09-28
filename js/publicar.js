/* =========================================================
   UAAVENTÓN
   PUBLICAR VIAJE
========================================================= */

(() => {

const PUBLISH_TRIPS_STORAGE_KEY =
    "uaaventon_trips";

const PUBLISH_USER_STORAGE_KEY =
    "uaaventonUser";


let currentPublishStep = 1;

let publishSeats = 3;


/* =========================================================
   USUARIO ACTUAL
========================================================= */

function getPublishCurrentUser() {

    try {

        const stored =
            localStorage.getItem(
                PUBLISH_USER_STORAGE_KEY
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


        if (!id) {
            return null;
        }


        return {

            id:
                id,

            name:
                user.name || "",

            lastName:
                user.lastName || "",

            fullName:
                fullName ||
                "Estudiante UAA",

            sex:
                user.sex || "",

            email:
                user.email || ""
        };

    } catch (error) {

        console.error(
            "No fue posible cargar el usuario:",
            error
        );

        return null;
    }
}


/* =========================================================
   ELEMENTOS
========================================================= */

const publishTripForm =
    document.getElementById(
        "publishTripForm"
    );

const publishNoVehicle =
    document.getElementById(
        "publishNoVehicle"
    );

const publishOrigin =
    document.getElementById(
        "publishOrigin"
    );

const publishDestination =
    document.getElementById(
        "publishDestination"
    );

const publishRoute =
    document.getElementById(
        "publishRoute"
    );

const publishDate =
    document.getElementById(
        "publishDate"
    );

const publishTime =
    document.getElementById(
        "publishTime"
    );

const publishPrice =
    document.getElementById(
        "publishPrice"
    );

const seatCount =
    document.getElementById(
        "seatCount"
    );

const publishVehicleOptions =
    document.getElementById(
        "publishVehicleOptions"
    );


/* =========================================================
   VEHÍCULOS
========================================================= */

function renderPublishVehicles() {

    if (!publishVehicleOptions) {
        return;
    }


    const vehicles =
        typeof window.getVehicles ===
            "function"
            ? window.getVehicles()
            : [];


    publishVehicleOptions.innerHTML =
        "";


    if (vehicles.length === 0) {

        if (publishNoVehicle) {

            publishNoVehicle.style.display =
                "flex";
        }


        if (publishTripForm) {

            publishTripForm.style.display =
                "none";
        }


        return;
    }


    if (publishNoVehicle) {

        publishNoVehicle.style.display =
            "none";
    }


    if (publishTripForm) {

        publishTripForm.style.display =
            "block";
    }


    vehicles.forEach(
        (vehicle, index) => {

            const label =
                document.createElement(
                    "label"
                );


            label.className =
                "publish-vehicle-option";


            label.innerHTML = `

                <input
                    type="radio"
                    name="publishVehicle"
                    value="${vehicle.id}"
                    ${index === 0 ? "checked" : ""}
                >


                <div class="publish-vehicle-option-content">

                    <div class="publish-vehicle-option-icon">

                        <i class="fa-solid fa-car-side"></i>

                    </div>


                    <div class="publish-vehicle-option-name">

                        <span>VEHÍCULO</span>

                        <strong>
                            ${vehicle.brand}
                            ${vehicle.model}
                        </strong>

                        <small>
                            ${vehicle.year}
                            ·
                            ${vehicle.color}
                        </small>

                    </div>


                    <div class="publish-vehicle-option-plates">

                        <small>PLACAS</small>

                        <strong>
                            ${
                                typeof window.hideVehiclePlates ===
                                    "function"
                                    ? window.hideVehiclePlates(
                                        vehicle.plates
                                    )
                                    : "***"
                            }
                        </strong>

                    </div>


                    <div class="publish-vehicle-check">

                        <i class="fa-solid fa-check"></i>

                    </div>

                </div>
            `;


            publishVehicleOptions
                .appendChild(
                    label
                );
        }
    );
}


/* =========================================================
   CAMBIAR PASO
========================================================= */

function goToPublishStep(step) {

    currentPublishStep =
        step;


    document
        .querySelectorAll(
            ".publish-step"
        )
        .forEach(section => {

            section.classList.toggle(
                "active",
                Number(
                    section.dataset.step
                ) === step
            );
        });


    document
        .querySelectorAll(
            ".publish-progress-item"
        )
        .forEach(item => {

            const itemStep =
                Number(
                    item.dataset.progress
                );


            item.classList.toggle(
                "active",
                itemStep === step
            );


            item.classList.toggle(
                "completed",
                itemStep < step
            );
        });


    if (step === 4) {

        updatePublishSummary();
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   VALIDAR PASO
========================================================= */

function validatePublishStep(step) {

    if (step === 1) {

        if (!publishOrigin.value) {

            publishOrigin.reportValidity();

            return false;
        }


        if (
            !publishDestination
                .value
                .trim()
        ) {

            publishDestination
                .reportValidity();

            return false;
        }


        if (
            !publishRoute
                .value
                .trim()
        ) {

            publishRoute
                .reportValidity();

            return false;
        }
    }


    if (step === 2) {

        if (!publishDate.value) {

            publishDate.reportValidity();

            return false;
        }


        if (!publishTime.value) {

            publishTime.reportValidity();

            return false;
        }


        const vehicle =
            document.querySelector(
                'input[name="publishVehicle"]:checked'
            );


        if (!vehicle) {

            return false;
        }
    }


    if (step === 3) {

        if (
            !publishPrice.value ||
            Number(
                publishPrice.value
            ) < 0
        ) {

            publishPrice.reportValidity();

            return false;
        }
    }


    return true;
}


/* =========================================================
   SIGUIENTE
========================================================= */

document
    .querySelectorAll(
        ".publish-next"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    !validatePublishStep(
                        currentPublishStep
                    )
                ) {

                    return;
                }


                goToPublishStep(
                    Number(
                        button.dataset.next
                    )
                );
            }
        );
    });


/* =========================================================
   REGRESAR
========================================================= */

document
    .querySelectorAll(
        ".publish-back"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                goToPublishStep(
                    Number(
                        button.dataset.back
                    )
                );
            }
        );
    });


/* =========================================================
   MAPA PREVIEW
========================================================= */

const mapOriginText =
    document.getElementById(
        "mapOriginText"
    );

const mapDestinationText =
    document.getElementById(
        "mapDestinationText"
    );


if (publishOrigin) {

    publishOrigin.addEventListener(
        "change",
        () => {

            if (mapOriginText) {

                mapOriginText.textContent =
                    publishOrigin.value ||
                    "UAA";
            }
        }
    );
}


if (publishDestination) {

    publishDestination.addEventListener(
        "input",
        () => {

            if (mapDestinationText) {

                mapDestinationText.textContent =
                    publishDestination
                        .value
                        .trim() ||
                    "Tu destino";
            }
        }
    );
}


/* =========================================================
   FECHA MÍNIMA
========================================================= */

if (publishDate) {

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


    publishDate.min =
        `${year}-${month}-${day}`;
}


/* =========================================================
   LUGARES
========================================================= */

const decreaseSeats =
    document.getElementById(
        "decreaseSeats"
    );

const increaseSeats =
    document.getElementById(
        "increaseSeats"
    );


function renderSeatCount() {

    if (seatCount) {

        seatCount.textContent =
            publishSeats;
    }
}


if (decreaseSeats) {

    decreaseSeats.addEventListener(
        "click",
        () => {

            if (publishSeats > 1) {

                publishSeats--;

                renderSeatCount();
            }
        }
    );
}


if (increaseSeats) {

    increaseSeats.addEventListener(
        "click",
        () => {

            if (publishSeats < 7) {

                publishSeats++;

                renderSeatCount();
            }
        }
    );
}


/* =========================================================
   VEHÍCULO SELECCIONADO
========================================================= */

function getSelectedVehicle() {

    const selected =
        document.querySelector(
            'input[name="publishVehicle"]:checked'
        );


    if (!selected) {

        return null;
    }


    const vehicles =
        typeof window.getVehicles ===
            "function"
            ? window.getVehicles()
            : [];


    return vehicles.find(
        vehicle =>
            vehicle.id ===
            selected.value
    ) || null;
}


/* =========================================================
   FORMATEAR FECHA
========================================================= */

function formatPublishDate(
    dateValue
) {

    if (!dateValue) {

        return "-";
    }


    const date =
        new Date(
            dateValue +
            "T12:00:00"
        );


    return new Intl.DateTimeFormat(
        "es-MX",
        {
            day:
                "numeric",

            month:
                "short",

            year:
                "numeric"
        }
    ).format(date);
}


/* =========================================================
   RESUMEN
========================================================= */

function updatePublishSummary() {

    const vehicle =
        getSelectedVehicle();


    document.getElementById(
        "summaryOrigin"
    ).textContent =
        publishOrigin.value;


    document.getElementById(
        "summaryDestination"
    ).textContent =
        publishDestination.value;


    document.getElementById(
        "summaryRoute"
    ).textContent =
        publishRoute.value;


    document.getElementById(
        "summaryDate"
    ).textContent =
        formatPublishDate(
            publishDate.value
        );


    document.getElementById(
        "summaryTime"
    ).textContent =
        publishTime.value;


    document.getElementById(
        "summarySeats"
    ).textContent =
        publishSeats === 1
            ? "1 lugar"
            : `${publishSeats} lugares`;


    document.getElementById(
        "summaryPrice"
    ).textContent =
        `$${publishPrice.value}`;


    if (vehicle) {

        document.getElementById(
            "summaryVehicle"
        ).textContent =
            `${vehicle.brand} ${vehicle.model}`;


        const protectedPlates =
            typeof window.hideVehiclePlates ===
                "function"
                ? window.hideVehiclePlates(
                    vehicle.plates
                )
                : "***";


        document.getElementById(
            "summaryVehicleInfo"
        ).textContent =
            `${vehicle.year} · ${vehicle.color} · ${protectedPlates}`;
    }
}


/* =========================================================
   VIAJES
========================================================= */

function getPublishedTrips() {

    try {

        const stored =
            localStorage.getItem(
                PUBLISH_TRIPS_STORAGE_KEY
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


function savePublishedTrips(
    trips
) {

    localStorage.setItem(
        PUBLISH_TRIPS_STORAGE_KEY,
        JSON.stringify(trips)
    );
}


/* =========================================================
   PUBLICAR
========================================================= */

if (publishTripForm) {

    publishTripForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            /* =============================================
               USUARIO
            ============================================== */

            const currentUser =
                getPublishCurrentUser();


            if (!currentUser) {

                alert(
                    "Necesitas completar tu perfil antes de publicar un viaje."
                );

                return;
            }


            /* =============================================
               CONFIRMACIÓN
            ============================================== */

            const confirmation =
                document.getElementById(
                    "publishConfirmation"
                );


            if (
                !confirmation ||
                !confirmation.checked
            ) {

                const confirmationBox =
                    document.querySelector(
                        ".publish-confirmation"
                    );


                if (confirmationBox) {

                    confirmationBox
                        .classList
                        .add(
                            "error"
                        );


                    setTimeout(
                        () => {

                            confirmationBox
                                .classList
                                .remove(
                                    "error"
                                );
                        },
                        700
                    );
                }


                return;
            }


            /* =============================================
               VEHÍCULO
            ============================================== */

            const vehicle =
                getSelectedVehicle();


            if (!vehicle) {

                alert(
                    "Selecciona un vehículo para publicar el viaje."
                );

                return;
            }


            /*
               Seguridad adicional:
               comprobamos que realmente sea
               propiedad del usuario actual.
            */

            if (
                vehicle.ownerId !==
                currentUser.id
            ) {

                alert(
                    "El vehículo seleccionado no pertenece a tu cuenta."
                );

                renderPublishVehicles();

                return;
            }


            /* =============================================
               CREAR VIAJE
            ============================================== */

            const trip = {

                id:
                    "UAAV-" +
                    Date.now(),

                driverId:
                    currentUser.id,

                driverName:
                    currentUser.fullName,

                origin:
                    publishOrigin.value,

                destination:
                    publishDestination
                        .value
                        .trim(),

                route:
                    publishRoute
                        .value
                        .trim(),

                date:
                    publishDate.value,

                time:
                    publishTime.value,

                vehicleId:
                    vehicle.id,

                vehicle:
                    `${vehicle.brand} ${vehicle.model}`,

                /*
                   Copia de la información del vehículo
                   en el momento de publicar.
                */

                vehicleInfo: {

                    brand:
                        vehicle.brand,

                    model:
                        vehicle.model,

                    year:
                        vehicle.year,

                    color:
                        vehicle.color,

                    plates:
                        vehicle.plates
                },

                seats:
                    publishSeats,

                availableSeats:
                    publishSeats,

                price:
                    Number(
                        publishPrice.value
                    ),

                /*
                   Upcoming = publicado pero
                   todavía no iniciado.
                */

                status:
                    "upcoming",

                role:
                    "driver",

                requests:
                    [],

                createdAt:
                    new Date()
                        .toISOString()
            };


            /* =============================================
               GUARDAR
            ============================================== */

            const trips =
                getPublishedTrips();


            trips.unshift(
                trip
            );


            savePublishedTrips(
                trips
            );


            /* =============================================
               MODAL DE ÉXITO
            ============================================== */

            const successRoute =
                document.getElementById(
                    "successRoute"
                );


            const successPrice =
                document.getElementById(
                    "successPrice"
                );


            if (successRoute) {

                successRoute.textContent =
                    `${trip.origin} → ${trip.destination}`;
            }


            if (successPrice) {

                successPrice.textContent =
                    `$${trip.price}`;
            }


            const modal =
                document.getElementById(
                    "publishSuccessModal"
                );


            if (modal) {

                modal.classList.add(
                    "open"
                );


                document.body.style.overflow =
                    "hidden";
            }
        }
    );
}


/* =========================================================
   ACTUALIZACIÓN ENTRE PESTAÑAS
========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
                "uaaventon_vehicles" ||

            event.key ===
                PUBLISH_USER_STORAGE_KEY
        ) {

            renderPublishVehicles();
        }
    }
);


/* =========================================================
   INICIALIZAR
========================================================= */

renderSeatCount();

renderPublishVehicles();

goToPublishStep(1);

})();