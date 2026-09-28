/* =========================================================
   UAAVENTÓN
   VEHÍCULOS
========================================================= */

(() => {

const VEHICLES_STORAGE_KEY = "uaaventon_vehicles";
const VEHICLES_USER_KEY = "uaaventonUser";


/* =========================================================
   USUARIO ACTUAL
========================================================= */

function getVehicleCurrentUser() {

    try {

        const stored =
            localStorage.getItem(
                VEHICLES_USER_KEY
            );

        if (!stored) {
            return null;
        }

        const user =
            JSON.parse(stored);

        return {
            id:
                user.universityId ||
                user.id ||
                null,

            name:
                user.name || "",

            lastName:
                user.lastName || ""
        };

    } catch (error) {

        console.error(
            "No fue posible obtener al usuario:",
            error
        );

        return null;
    }
}


/* =========================================================
   OBTENER TODOS LOS VEHÍCULOS
========================================================= */

function getAllVehicles() {

    try {

        const stored =
            localStorage.getItem(
                VEHICLES_STORAGE_KEY
            );

        return stored
            ? JSON.parse(stored)
            : [];

    } catch (error) {

        console.error(
            "No fue posible leer los vehículos:",
            error
        );

        return [];
    }
}


/* =========================================================
   GUARDAR TODOS LOS VEHÍCULOS
========================================================= */

function saveAllVehicles(vehicles) {

    localStorage.setItem(
        VEHICLES_STORAGE_KEY,
        JSON.stringify(vehicles)
    );
}


/* =========================================================
   MIGRAR VEHÍCULOS ANTIGUOS
========================================================= */

function migrateOldVehicles() {

    const user =
        getVehicleCurrentUser();

    if (!user || !user.id) {
        return;
    }

    const vehicles =
        getAllVehicles();

    let changed =
        false;

    vehicles.forEach(vehicle => {

        /*
           Vehículos creados antes de implementar
           usuarios propietarios.
        */

        if (!vehicle.ownerId) {

            vehicle.ownerId =
                user.id;

            changed =
                true;
        }
    });

    if (changed) {

        saveAllVehicles(
            vehicles
        );
    }
}


/* =========================================================
   VEHÍCULOS DEL USUARIO ACTUAL
========================================================= */

function getVehicles() {

    const user =
        getVehicleCurrentUser();

    if (!user || !user.id) {
        return [];
    }

    return getAllVehicles()
        .filter(
            vehicle =>
                vehicle.ownerId ===
                user.id
        );
}


/* =========================================================
   GUARDAR VEHÍCULOS DEL USUARIO
========================================================= */

function saveVehicles(userVehicles) {

    const user =
        getVehicleCurrentUser();

    if (!user || !user.id) {
        return;
    }

    const allVehicles =
        getAllVehicles();

    /*
       Conservamos los vehículos
       pertenecientes a otros usuarios.
    */

    const otherVehicles =
        allVehicles.filter(
            vehicle =>
                vehicle.ownerId !==
                user.id
        );

    const normalizedVehicles =
        userVehicles.map(
            vehicle => ({
                ...vehicle,
                ownerId:
                    user.id
            })
        );

    saveAllVehicles([
        ...otherVehicles,
        ...normalizedVehicles
    ]);
}


/* =========================================================
   OCULTAR PLACAS
========================================================= */

function hideVehiclePlates(plates) {

    if (!plates) {
        return "***";
    }

    const clean =
        plates
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
   EXPONER FUNCIONES PARA PUBLICAR.JS
========================================================= */

window.getVehicles =
    getVehicles;

window.hideVehiclePlates =
    hideVehiclePlates;


/* =========================================================
   ELEMENTOS
========================================================= */

const vehicleModal =
    document.getElementById(
        "vehicleModal"
    );

const vehicleForm =
    document.getElementById(
        "vehicleForm"
    );

const vehiclesGrid =
    document.getElementById(
        "vehiclesGrid"
    );

const vehiclesEmpty =
    document.getElementById(
        "vehiclesEmpty"
    );

const vehicleCount =
    document.getElementById(
        "vehicleCount"
    );

const openVehicleModal =
    document.getElementById(
        "openVehicleModal"
    );

const emptyAddVehicle =
    document.getElementById(
        "emptyAddVehicle"
    );

const closeVehicleModal =
    document.getElementById(
        "closeVehicleModal"
    );

const cancelVehicle =
    document.getElementById(
        "cancelVehicle"
    );


/* =========================================================
   ABRIR MODAL
========================================================= */

function showVehicleModal() {

    if (!vehicleModal) return;

    const user =
        getVehicleCurrentUser();

    if (!user || !user.id) {

        alert(
            "Necesitas completar tu perfil antes de registrar un vehículo."
        );

        return;
    }

    vehicleModal.classList.add(
        "open"
    );

    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   CERRAR MODAL
========================================================= */

function hideVehicleModal() {

    if (!vehicleModal) return;

    vehicleModal.classList.remove(
        "open"
    );

    document.body.style.overflow =
        "";
}


/* =========================================================
   EVENTOS MODAL
========================================================= */

if (openVehicleModal) {

    openVehicleModal.addEventListener(
        "click",
        showVehicleModal
    );
}

if (emptyAddVehicle) {

    emptyAddVehicle.addEventListener(
        "click",
        showVehicleModal
    );
}

if (closeVehicleModal) {

    closeVehicleModal.addEventListener(
        "click",
        hideVehicleModal
    );
}

if (cancelVehicle) {

    cancelVehicle.addEventListener(
        "click",
        hideVehicleModal
    );
}

if (vehicleModal) {

    const overlay =
        vehicleModal.querySelector(
            ".vehicle-modal-overlay"
        );

    if (overlay) {

        overlay.addEventListener(
            "click",
            hideVehicleModal
        );
    }
}


/* =========================================================
   RENDERIZAR VEHÍCULOS
========================================================= */

function renderVehicles() {

    if (!vehiclesGrid) return;

    const vehicles =
        getVehicles();

    vehiclesGrid.innerHTML =
        "";

    if (vehicleCount) {

        vehicleCount.textContent =
            vehicles.length === 1
                ? "1 vehículo"
                : `${vehicles.length} vehículos`;
    }

    if (vehicles.length === 0) {

        if (vehiclesEmpty) {

            vehiclesEmpty.style.display =
                "block";
        }

        return;
    }

    if (vehiclesEmpty) {

        vehiclesEmpty.style.display =
            "none";
    }

    vehicles.forEach(
        vehicle => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "vehicle-card";

            card.innerHTML = `

                <div class="vehicle-card-top">

                    <div class="vehicle-card-icon">
                        <i class="fa-solid fa-car-side"></i>
                    </div>

                    <div class="vehicle-card-menu">

                        <button
                            type="button"
                            class="delete-vehicle-button"
                            data-id="${vehicle.id}"
                            aria-label="Eliminar vehículo"
                        >
                            <i class="fa-regular fa-trash-can"></i>
                        </button>

                    </div>

                </div>


                <div class="vehicle-card-name">

                    <span>VEHÍCULO</span>

                    <h3>
                        ${vehicle.brand}
                        ${vehicle.model}
                    </h3>

                    <p>
                        ${vehicle.year}
                    </p>

                </div>


                <div class="vehicle-card-details">

                    <div>

                        <small>COLOR</small>

                        <strong>
                            ${vehicle.color}
                        </strong>

                    </div>


                    <div>

                        <small>PLACAS</small>

                        <strong>
                            ${hideVehiclePlates(
                                vehicle.plates
                            )}
                        </strong>

                    </div>

                </div>


                <div class="vehicle-card-status">

                    <span>
                        <i class="fa-solid fa-circle-check"></i>
                        Disponible para publicar
                    </span>

                </div>
            `;

            vehiclesGrid.appendChild(
                card
            );
        }
    );


    document
        .querySelectorAll(
            ".delete-vehicle-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    requestDeleteVehicle(
                        button.dataset.id
                    );
                }
            );
        });
}


/* =========================================================
   REGISTRAR VEHÍCULO
========================================================= */

if (vehicleForm) {

    vehicleForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const user =
                getVehicleCurrentUser();

            if (!user || !user.id) {

                alert(
                    "Necesitas completar tu perfil antes de registrar un vehículo."
                );

                return;
            }


            const brand =
                document
                    .getElementById(
                        "vehicleBrand"
                    )
                    .value
                    .trim();

            const model =
                document
                    .getElementById(
                        "vehicleModel"
                    )
                    .value
                    .trim();

            const year =
                document
                    .getElementById(
                        "vehicleYear"
                    )
                    .value;

            const color =
                document
                    .getElementById(
                        "vehicleColor"
                    )
                    .value
                    .trim();

            const plates =
                document
                    .getElementById(
                        "vehiclePlates"
                    )
                    .value
                    .trim()
                    .toUpperCase();


            if (
                !brand ||
                !model ||
                !year ||
                !color ||
                !plates
            ) {
                return;
            }


            const vehicles =
                getVehicles();


            /*
               Evitamos placas duplicadas
               para el mismo usuario.
            */

            const duplicatePlates =
                vehicles.some(
                    vehicle =>
                        String(
                            vehicle.plates
                        )
                            .toUpperCase()
                            .trim() ===
                        plates
                );


            if (duplicatePlates) {

                alert(
                    "Ya tienes un vehículo registrado con estas placas."
                );

                return;
            }


            const newVehicle = {

                id:
                    "VEH-" +
                    Date.now(),

                ownerId:
                    user.id,

                brand:
                    brand,

                model:
                    model,

                year:
                    year,

                color:
                    color,

                plates:
                    plates,

                createdAt:
                    new Date()
                        .toISOString()
            };


            vehicles.push(
                newVehicle
            );


            saveVehicles(
                vehicles
            );


            vehicleForm.reset();

            hideVehicleModal();

            renderVehicles();
        }
    );
}


/* =========================================================
   ELIMINAR VEHÍCULO
========================================================= */

let pendingVehicleDelete =
    null;


const vehicleDeleteModal =
    document.getElementById(
        "vehicleDeleteModal"
    );

const cancelDeleteVehicle =
    document.getElementById(
        "cancelDeleteVehicle"
    );

const confirmDeleteVehicle =
    document.getElementById(
        "confirmDeleteVehicle"
    );


function requestDeleteVehicle(
    vehicleId
) {

    pendingVehicleDelete =
        vehicleId;

    if (vehicleDeleteModal) {

        vehicleDeleteModal
            .classList
            .add(
                "open"
            );

        document.body.style.overflow =
            "hidden";
    }
}


function closeDeleteVehicleModal() {

    pendingVehicleDelete =
        null;

    if (vehicleDeleteModal) {

        vehicleDeleteModal
            .classList
            .remove(
                "open"
            );
    }

    document.body.style.overflow =
        "";
}


if (cancelDeleteVehicle) {

    cancelDeleteVehicle.addEventListener(
        "click",
        closeDeleteVehicleModal
    );
}


if (vehicleDeleteModal) {

    const overlay =
        vehicleDeleteModal.querySelector(
            ".vehicle-modal-overlay"
        );

    if (overlay) {

        overlay.addEventListener(
            "click",
            closeDeleteVehicleModal
        );
    }
}


if (confirmDeleteVehicle) {

    confirmDeleteVehicle.addEventListener(
        "click",
        () => {

            if (!pendingVehicleDelete) {
                return;
            }


            const vehicles =
                getVehicles();


            const updatedVehicles =
                vehicles.filter(
                    vehicle =>
                        vehicle.id !==
                        pendingVehicleDelete
                );


            saveVehicles(
                updatedVehicles
            );


            closeDeleteVehicleModal();

            renderVehicles();
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
                VEHICLES_STORAGE_KEY ||

            event.key ===
                VEHICLES_USER_KEY
        ) {

            migrateOldVehicles();

            renderVehicles();
        }
    }
);


/* =========================================================
   INICIALIZAR
========================================================= */

migrateOldVehicles();

renderVehicles();

})();