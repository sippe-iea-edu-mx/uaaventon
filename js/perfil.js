/* =========================================================
   UAAVENTÓN
   PERFIL
========================================================= */

const PROFILE_USER_KEY =
    "uaaventonUser";

const PROFILE_TRIPS_KEY =
    "uaaventon_trips";

const PROFILE_VEHICLES_KEY =
    "uaaventon_vehicles";


/* =========================================================
   OBTENER DATOS
========================================================= */

function getProfileUser() {

    try {

        const stored =
            localStorage.getItem(
                PROFILE_USER_KEY
            );


        if (stored) {

            const user =
                JSON.parse(stored);


            return {

                name:
                    user.name ||
                    "Estudiante",

                lastName:
                    user.lastName ||
                    "",

                universityId:
                    user.universityId ||
                    user.id ||
                    "",

                sex:
                    user.sex ||
                    "",

                email:
                    user.email ||
                    "",

                createdAt:
                    user.createdAt ||
                    null

            };

        }

    } catch (error) {

        console.error(
            "No fue posible cargar el perfil:",
            error
        );

    }


    /*
       Usuario temporal si todavía no existe
       una cuenta guardada.
    */

    return {

        name:
            "Estudiante",

        lastName:
            "UAA",

        universityId:
            "",

        sex:
            "",

        email:
            "",

        createdAt:
            null

    };

}


function getProfileTrips() {

    try {

        const stored =
            localStorage.getItem(
                PROFILE_TRIPS_KEY
            );

        const allTrips =
            stored
                ? JSON.parse(stored)
                : [];

        const user =
            getProfileUser();

        const userId =
            user.universityId;

        /*
           Si no existe un usuario identificado,
           no mostramos viajes de otras cuentas.
        */

        if (!userId) {
            return [];
        }


        /*
           Un viaje pertenece al usuario cuando:

           - Es conductor y driverId coincide.
           - Es pasajero y passengerId coincide.
        */

        return allTrips.filter(
            trip => {

                if (trip.role === "driver") {

                    return String(
                        trip.driverId || ""
                    ) === String(userId);

                }


                if (trip.role === "passenger") {

                    return String(
                        trip.passengerId || ""
                    ) === String(userId);

                }


                return false;

            }
        );

    } catch (error) {

        console.error(
            "No fue posible cargar los viajes del perfil:",
            error
        );

        return [];

    }

}


function getProfileVehicles() {

    try {

        const stored =
            localStorage.getItem(
                PROFILE_VEHICLES_KEY
            );

        const allVehicles =
            stored
                ? JSON.parse(stored)
                : [];

        const user =
            getProfileUser();

        const userId =
            user.universityId;


        if (!userId) {
            return [];
        }


        /*
           Solo mostramos vehículos cuyo
           ownerId pertenece al usuario actual.
        */

        return allVehicles.filter(
            vehicle =>

                String(
                    vehicle.ownerId || ""
                ) === String(userId)
        );

    } catch (error) {

        console.error(
            "No fue posible cargar los vehículos del perfil:",
            error
        );

        return [];

    }

}


/* =========================================================
   GUARDAR USUARIO
========================================================= */

function saveProfileUser(user) {

    localStorage.setItem(
        PROFILE_USER_KEY,
        JSON.stringify(user)
    );

}


/* =========================================================
   NOMBRE COMPLETO
========================================================= */

function getProfileFullName(user) {

    return `${user.name || ""} ${user.lastName || ""}`
        .replace(/\s+/g, " ")
        .trim()
        || "Estudiante UAA";

}


/* =========================================================
   INICIALES
========================================================= */

function getProfileInitials(name) {

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
   FECHA
========================================================= */

function formatProfileDate(dateValue) {

    if (!dateValue) {

        return "Recientemente";

    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Recientemente";

    }


    return new Intl.DateTimeFormat(
        "es-MX",
        {
            month:
                "long",

            year:
                "numeric"
        }
    ).format(date);

}


function formatProfileTripDate(
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
            day:
                "numeric",

            month:
                "short"
        }
    ).format(date);

}


/* =========================================================
   OCULTAR PLACAS
========================================================= */

function profileHidePlates(plates) {

    if (!plates) {

        return "***";

    }


    const clean =
        String(plates)
            .toUpperCase()
            .trim();


    if (clean.length <= 3) {

        return "***";

    }


    return (
        "***" +
        clean.substring(
            clean.length - 4
        )
    );

}


/* =========================================================
   RENDERIZAR PERFIL
========================================================= */

function renderProfile() {

    const user =
        getProfileUser();


    const trips =
        getProfileTrips();


    const vehicles =
        getProfileVehicles();


    const fullName =
        getProfileFullName(
            user
        );


    /* =====================================================
       INFORMACIÓN PRINCIPAL
    ====================================================== */

    const profileFullName =
        document.getElementById(
            "profileFullName"
        );


    const profileUniversityId =
        document.getElementById(
            "profileUniversityId"
        );


    const profileEmail =
        document.getElementById(
            "profileEmail"
        );


    const profileSex =
        document.getElementById(
            "profileSex"
        );


    const profileMemberSince =
        document.getElementById(
            "profileMemberSince"
        );


    if (profileFullName) {

        profileFullName.textContent =
            fullName;

    }


    if (profileUniversityId) {

        profileUniversityId.textContent =
            user.universityId ||
            "Sin registrar";

    }


    if (profileEmail) {

        profileEmail.textContent =
            user.email ||
            "Sin registrar";

    }


    if (profileSex) {

        profileSex.textContent =
            user.sex ||
            "Sin registrar";

    }


    if (profileMemberSince) {

        profileMemberSince.textContent =
            formatProfileDate(
                user.createdAt
            );

    }


    /* =====================================================
       AVATAR
    ====================================================== */

    const initials =
        getProfileInitials(
            fullName
        );


    const profileAvatar =
        document.getElementById(
            "profileAvatar"
        );


    const headerAvatar =
        document.getElementById(
            "headerProfileAvatar"
        );


    if (profileAvatar) {

        profileAvatar.textContent =
            initials;

    }


    if (headerAvatar) {

        headerAvatar.textContent =
            initials;

    }


    /* =====================================================
       HEADER
    ====================================================== */

    const headerName =
        document.getElementById(
            "headerProfileName"
        );


    if (headerName) {

        headerName.textContent =
            user.name ||
            "Estudiante";

    }


    /* =====================================================
       ESTADÍSTICAS
    ====================================================== */

    const driverTrips =
        trips.filter(
            trip =>
                trip.role ===
                    "driver"
        );


    const passengerTrips =
        trips.filter(
            trip =>
                trip.role ===
                    "passenger"
        );


    const completedTrips =
        trips.filter(
            trip =>
                trip.status ===
                    "finished"
        );


    const completedElement =
        document.getElementById(
            "profileCompletedTrips"
        );


    const driverElement =
        document.getElementById(
            "profileDriverTrips"
        );


    const passengerElement =
        document.getElementById(
            "profilePassengerTrips"
        );


    if (completedElement) {

        completedElement.textContent =
            completedTrips.length;

    }


    if (driverElement) {

        driverElement.textContent =
            driverTrips.length;

    }


    if (passengerElement) {

        passengerElement.textContent =
            passengerTrips.length;

    }


    /* =====================================================
       CALIFICACIÓN
    ====================================================== */

    const profileRating =
        document.getElementById(
            "profileRating"
        );


    const profileRatingText =
        document.getElementById(
            "profileRatingText"
        );


    /*
       Todavía no existe un sistema de
       calificaciones persistentes.

       Por eso NO inventamos un 4.9 o 5.0.
    */

    if (profileRating) {

        profileRating.textContent =
            "-";

    }


    if (profileRatingText) {

        profileRatingText.textContent =
            "Sin calificaciones";

    }


    /* =====================================================
       VEHÍCULOS
    ====================================================== */

    const vehicleCount =
        document.getElementById(
            "profileVehicleCount"
        );


    if (vehicleCount) {

        vehicleCount.textContent =
            vehicles.length;

    }


    renderProfileVehicles(
        vehicles
    );


    /* =====================================================
       HISTORIAL
    ====================================================== */

    renderProfileHistory(
        trips
    );

}


/* =========================================================
   VEHÍCULOS DEL PERFIL
========================================================= */

function renderProfileVehicles(
    vehicles
) {

    const container =
        document.getElementById(
            "profileVehiclePreview"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (vehicles.length === 0) {

        container.innerHTML = `

            <div class="profile-no-vehicle">

                <div>

                    <i class="fa-solid fa-car-side"></i>

                </div>


                <strong>
                    Aún no tienes vehículos
                </strong>


                <p>
                    Registra tu primer vehículo para
                    comenzar a publicar viajes.
                </p>


                <a
                    href="vehiculos.html"
                    class="btn btn-primary"
                >

                    <i class="fa-solid fa-plus"></i>

                    Registrar vehículo

                </a>

            </div>

        `;


        return;

    }


    /*
       Mostramos máximo los primeros dos.
    */

    vehicles
        .slice(0, 2)
        .forEach(vehicle => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "profile-vehicle-item";


            item.innerHTML = `

                <div class="profile-vehicle-icon">

                    <i class="fa-solid fa-car-side"></i>

                </div>


                <div class="profile-vehicle-data">

                    <strong>
                        ${vehicle.brand || ""}
                        ${vehicle.model || ""}
                    </strong>


                    <span>

                        ${vehicle.year || ""}

                        ·

                        ${vehicle.color || ""}

                    </span>

                </div>


                <div class="profile-vehicle-plates">

                    <small>
                        PLACAS
                    </small>

                    <strong>
                        ${profileHidePlates(
                            vehicle.plates
                        )}
                    </strong>

                </div>

            `;


            container.appendChild(
                item
            );

        });

}


/* =========================================================
   HISTORIAL DE VIAJES
========================================================= */

function renderProfileHistory(
    trips
) {

    const container =
        document.getElementById(
            "profileHistoryList"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (trips.length === 0) {

        container.innerHTML = `

            <div class="profile-history-empty">

                <div>

                    <i class="fa-solid fa-route"></i>

                </div>


                <strong>
                    Todavía no tienes viajes
                </strong>


                <p>
                    Cuando publiques o solicites un viaje,
                    aparecerá aquí.
                </p>

            </div>

        `;


        return;

    }


    const orderedTrips =
        [...trips]
            .sort(
                (a, b) => {

                    const dateA =
                        `${a.date || ""}T${a.time || "00:00"}`;

                    const dateB =
                        `${b.date || ""}T${b.time || "00:00"}`;


                    return dateB.localeCompare(
                        dateA
                    );

                }
            )
            .slice(
                0,
                3
            );


    orderedTrips.forEach(
        trip => {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "profile-history-item";


            const isDriver =
                trip.role ===
                    "driver";


            let statusText =
                "Próximo";


            let statusClass =
                "upcoming";


            if (
                trip.status ===
                    "in_progress"
            ) {

                statusText =
                    "En camino";

                statusClass =
                    "active";

            }


            if (
                trip.status ===
                    "finished"
            ) {

                statusText =
                    "Finalizado";

                statusClass =
                    "finished";

            }


            if (
                trip.status ===
                    "cancelled"
            ) {

                statusText =
                    "Cancelado";

                statusClass =
                    "cancelled";

            }


            item.innerHTML = `

                <div class="profile-history-role">

                    <div>

                        <i class="fa-solid ${
                            isDriver
                                ? "fa-car-side"
                                : "fa-user"
                        }"></i>

                    </div>


                    <span>

                        ${
                            isDriver
                                ? "Conductor"
                                : "Pasajero"
                        }

                    </span>

                </div>


                <div class="profile-history-route">

                    <small>
                        ${formatProfileTripDate(
                            trip.date
                        )}
                        ·
                        ${trip.time || "--:--"}
                    </small>


                    <strong>

                        ${trip.origin || "UAA"}

                        <i class="fa-solid fa-arrow-right"></i>

                        ${trip.destination || "Destino"}

                    </strong>

                </div>


                <div class="profile-history-price">

                    <small>
                        POR PERSONA
                    </small>

                    <strong>
                        $${trip.price ?? 0}
                    </strong>

                </div>


                <span
                    class="profile-history-status ${statusClass}"
                >
                    ${statusText}
                </span>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   MODAL EDITAR
========================================================= */

const profileEditModal =
    document.getElementById(
        "profileEditModal"
    );


const openEditProfile =
    document.getElementById(
        "openEditProfile"
    );


const closeEditProfile =
    document.getElementById(
        "closeEditProfile"
    );


const cancelEditProfile =
    document.getElementById(
        "cancelEditProfile"
    );


const profileEditForm =
    document.getElementById(
        "profileEditForm"
    );


function openProfileModal() {

    if (!profileEditModal) {

        return;

    }


    const user =
        getProfileUser();


    document.getElementById(
        "editProfileName"
    ).value =
        user.name || "";


    document.getElementById(
        "editProfileLastName"
    ).value =
        user.lastName || "";


    document.getElementById(
        "editProfileUniversityId"
    ).value =
        user.universityId || "";


    document.getElementById(
        "editProfileSex"
    ).value =
        user.sex || "";


    document.getElementById(
        "editProfileEmail"
    ).value =
        user.email || "";


    profileEditModal.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";

}


function closeProfileModal() {

    if (!profileEditModal) {

        return;

    }


    profileEditModal.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";

}


if (openEditProfile) {

    openEditProfile.addEventListener(
        "click",
        openProfileModal
    );

}


if (closeEditProfile) {

    closeEditProfile.addEventListener(
        "click",
        closeProfileModal
    );

}


if (cancelEditProfile) {

    cancelEditProfile.addEventListener(
        "click",
        closeProfileModal
    );

}


if (profileEditModal) {

    const overlay =
        profileEditModal.querySelector(
            ".profile-modal-overlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeProfileModal
        );

    }

}


/* =========================================================
   GUARDAR PERFIL
========================================================= */

if (profileEditForm) {

    profileEditForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const previousUser =
                getProfileUser();


            const name =
                document
                    .getElementById(
                        "editProfileName"
                    )
                    .value
                    .trim();


            const lastName =
                document
                    .getElementById(
                        "editProfileLastName"
                    )
                    .value
                    .trim();


            const universityId =
                document
                    .getElementById(
                        "editProfileUniversityId"
                    )
                    .value
                    .trim();


            const sex =
                document
                    .getElementById(
                        "editProfileSex"
                    )
                    .value;


            const email =
                document
                    .getElementById(
                        "editProfileEmail"
                    )
                    .value
                    .trim();


            if (
                !name ||
                !lastName ||
                !universityId ||
                !sex ||
                !email
            ) {

                return;

            }


            const updatedUser = {

                ...previousUser,

                name:
                    name,

                lastName:
                    lastName,

                universityId:
                    universityId,

                sex:
                    sex,

                email:
                    email,

                createdAt:
                    previousUser.createdAt ||
                    new Date().toISOString()

            };


            saveProfileUser(
                updatedUser
            );


            closeProfileModal();


            renderProfile();

        }
    );

}


/* =========================================================
   ACTUALIZACIÓN DE LOCAL STORAGE
========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
                PROFILE_USER_KEY ||

            event.key ===
                PROFILE_TRIPS_KEY ||

            event.key ===
                PROFILE_VEHICLES_KEY
        ) {

            renderProfile();

        }

    }
);


/* =========================================================
   INICIALIZAR
========================================================= */

renderProfile();