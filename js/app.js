/* =========================================================
   UAAVENTÓN
   JavaScript general de la interfaz
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MENÚ MÓVIL
    ===================================================== */

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const mobileCloseButton =
        document.getElementById("mobileCloseButton");

    const mobileMenu =
        document.getElementById("mobileMenu");


    function openMobileMenu() {

        if (!mobileMenu) return;

        mobileMenu.classList.add("open");

        document.body.classList.add("menu-open");
    }


    function closeMobileMenu() {

        if (!mobileMenu) return;

        mobileMenu.classList.remove("open");

        document.body.classList.remove("menu-open");
    }


    if (mobileMenuButton) {

        mobileMenuButton.addEventListener(
            "click",
            openMobileMenu
        );

    }


    if (mobileCloseButton) {

        mobileCloseButton.addEventListener(
            "click",
            closeMobileMenu
        );

    }


    /* =====================================================
       CERRAR MENÚ AL HACER CLICK EN UN LINK
    ===================================================== */

    const mobileLinks =
        document.querySelectorAll(".mobile-menu-links a");


    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            closeMobileMenu();

        });

    });


    /* =====================================================
       ESC PARA CERRAR MENÚ
    ===================================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeMobileMenu();

        }

    });


    /* =====================================================
       FECHA MÍNIMA DEL BUSCADOR
    ===================================================== */

    const dateInput =
        document.getElementById("date");


    if (dateInput) {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(today.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(today.getDate())
                .padStart(2, "0");

        const formattedDate =
            `${year}-${month}-${day}`;

        dateInput.min = formattedDate;

    }


    /* =====================================================
       EFECTO DEL HEADER AL HACER SCROLL
    ===================================================== */

    const header =
        document.querySelector(".header");


    function updateHeader() {

        if (!header) return;


        if (window.scrollY > 15) {

            header.style.boxShadow =
                "0 5px 20px rgba(17, 24, 39, 0.05)";

        } else {

            header.style.boxShadow =
                "none";

        }

    }


    window.addEventListener(
        "scroll",
        updateHeader
    );


    updateHeader();

});

/* =========================================================
   UAAVENTÓN
   Login, registro y dashboard
========================================================= */


/* =========================================================
   MOSTRAR / OCULTAR CONTRASEÑA
========================================================= */

const passwordButtons =
    document.querySelectorAll(".password-toggle");


passwordButtons.forEach(button => {

    button.addEventListener("click", () => {

        const targetId =
            button.dataset.passwordTarget;

        const input =
            document.getElementById(targetId);

        if (!input) return;


        const icon =
            button.querySelector("i");


        if (input.type === "password") {

            input.type = "text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        } else {

            input.type = "password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    });

});

/* =========================================================
   SISTEMA DE USUARIOS
========================================================= */

const USERS_STORAGE_KEY =
    "uaaventon_users";

const CURRENT_USER_STORAGE_KEY =
    "uaaventonUser";

const NOTIFICATIONS_STORAGE_KEY =
    "uaaventon_notifications";


function getRegisteredUsers() {

    try {

        const stored =
            localStorage.getItem(
                USERS_STORAGE_KEY
            );

        return stored
            ? JSON.parse(stored)
            : [];

    } catch (error) {

        console.error(
            "No fue posible cargar los usuarios:",
            error
        );

        return [];
    }

}


function saveRegisteredUsers(users) {

    localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(users)
    );

}


function setCurrentUser(user) {

    localStorage.setItem(
        CURRENT_USER_STORAGE_KEY,
        JSON.stringify(user)
    );

}

/* =========================================================
   SESIÓN ACTUAL
========================================================= */

function getCurrentSessionUser() {

    try {

        const stored =
            localStorage.getItem(
                CURRENT_USER_STORAGE_KEY
            );

        return stored
            ? JSON.parse(stored)
            : null;

    } catch (error) {

        console.error(
            "No fue posible obtener la sesión:",
            error
        );

        return null;
    }

}

/* =========================================================
   INICIALES DEL USUARIO
========================================================= */

function getUserInitials(
    name,
    lastName
) {

    const firstInitial =
        String(name || "")
            .trim()
            .charAt(0)
            .toUpperCase();


    const lastInitial =
        String(lastName || "")
            .trim()
            .charAt(0)
            .toUpperCase();


    return (
        firstInitial +
        lastInitial
    ) || "UA";
}

/* =========================================================
   ACTUALIZAR USUARIO EN LA INTERFAZ
========================================================= */

function updateCurrentUserInterface() {

    const user =
        getCurrentSessionUser();


    if (!user) {
        return;
    }


    const name =
        String(
            user.name || "Estudiante"
        ).trim();


    const lastName =
        String(
            user.lastName || ""
        ).trim();


    const initials =
        getUserInitials(
            name,
            lastName
        );


    /*
       AVATARES DEL HEADER
    */

    const avatars =
        document.querySelectorAll(
            ".dashboard-avatar"
        );


    avatars.forEach(
        avatar => {

            avatar.textContent =
                initials;

        }
    );


    /*
       NOMBRE DEL HEADER

       Buscamos únicamente el strong que está
       dentro del enlace del perfil para no
       modificar otros textos de la página.
    */

    const profileNames =
        document.querySelectorAll(
            ".dashboard-profile strong"
        );


    profileNames.forEach(
        element => {

            element.textContent =
                name;

        }
    );

    /*
   SALUDO DEL DASHBOARD
*/

const dashboardGreeting =
    document.querySelector(
        ".dashboard-hero h1"
    );


if (dashboardGreeting) {

    dashboardGreeting.innerHTML = `
        Hola, ${name}.
        <span>
            ¿A dónde vas hoy?
        </span>
    `;

}

}

document.addEventListener(
    "DOMContentLoaded",
    updateCurrentUserInterface
);

function logoutUser() {

    /*
       Eliminamos únicamente la sesión.

       NO borramos:
       - cuentas
       - vehículos
       - viajes
       - solicitudes
    */

    localStorage.removeItem(
        CURRENT_USER_STORAGE_KEY
    );


    window.location.href =
        "login.html";
}

/* =========================================================
   PROTECCIÓN DE PÁGINAS PRIVADAS
========================================================= */

const PRIVATE_PAGES = [

    "dashboard.html",
    "buscar.html",
    "viaje.html",
    "publicar.html",
    "mis-viajes.html",
    "perfil.html",
    "vehiculos.html"

];


function protectPrivatePage() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    const isPrivatePage =
        PRIVATE_PAGES.includes(
            currentPage
        );


    if (!isPrivatePage) {
        return;
    }


    const currentUser =
        getCurrentSessionUser();


    if (!currentUser) {

        window.location.href =
            "login.html";
    }

}


protectPrivatePage();

/* =========================================================
   EVITAR LOGIN / REGISTRO CON SESIÓN ACTIVA
========================================================= */

function redirectAuthenticatedUser() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    const authPages = [
        "login.html",
        "registro.html"
    ];


    if (
        authPages.includes(currentPage) &&
        getCurrentSessionUser()
    ) {

        window.location.href =
            "dashboard.html";
    }

}


redirectAuthenticatedUser();

/* =========================================================
   MENÚ DESPLEGABLE DE USUARIO
========================================================= */

function createUserDropdown() {

    const user =
        getCurrentSessionUser();


    if (!user) {
        return;
    }


    const userAreas =
        document.querySelectorAll(
            ".dashboard-user"
        );


    if (!userAreas.length) {
        return;
    }


    const name =
        String(
            user.name || "Estudiante"
        ).trim();


    const lastName =
        String(
            user.lastName || ""
        ).trim();


    const fullName =
        `${name} ${lastName}`
            .replace(/\s+/g, " ")
            .trim();


    const universityId =
        user.universityId ||
        user.id ||
        "";


    const initials =
        getUserInitials(
            name,
            lastName
        );


    userAreas.forEach(
        userArea => {

            /*
               Evitar duplicados.
            */

            if (
                userArea.querySelector(
                    ".user-dropdown"
                )
            ) {
                return;
            }


            /*
               Eliminamos únicamente el enlace
               anterior del perfil.

               La campana de notificaciones
               permanece intacta.
            */

            const oldProfile =
                userArea.querySelector(
                    ".dashboard-profile"
                );


            if (oldProfile) {

                oldProfile.remove();

            }


            /*
               CONTENEDOR
            */

            const dropdown =
                document.createElement(
                    "div"
                );


            dropdown.className =
                "user-dropdown";


            dropdown.innerHTML = `

                <button
                    type="button"
                    class="user-dropdown-trigger"
                    aria-expanded="false"
                >

                    <div class="dashboard-avatar">
                        ${initials}
                    </div>


                    <div class="user-dropdown-trigger-text">

                        <strong>
                            ${name}
                        </strong>

                        <small>
                            Estudiante
                        </small>

                    </div>


                    <i
                        class="fa-solid fa-chevron-down user-dropdown-arrow"
                    ></i>

                </button>


                <div class="user-dropdown-menu">

                    <div class="user-dropdown-header">

                        <div class="user-dropdown-large-avatar">
                            ${initials}
                        </div>


                        <div>

                            <strong>
                                ${fullName}
                            </strong>

                            <span>
                                ID: ${universityId}
                            </span>

                        </div>

                    </div>


                    <div class="user-dropdown-divider"></div>


                    <a
                        href="perfil.html"
                        class="user-dropdown-item"
                    >

                        <i class="fa-regular fa-user"></i>

                        <span>
                            Mi perfil
                        </span>

                    </a>


                    <a
                        href="vehiculos.html"
                        class="user-dropdown-item"
                    >

                        <i class="fa-solid fa-car"></i>

                        <span>
                            Mis vehículos
                        </span>

                    </a>


                    <div class="user-dropdown-divider"></div>


                    <button
                        type="button"
                        class="user-dropdown-item user-dropdown-logout"
                    >

                        <i class="fa-solid fa-arrow-right-from-bracket"></i>

                        <span>
                            Cerrar sesión
                        </span>

                    </button>

                </div>

            `;


            userArea.appendChild(
                dropdown
            );


            /*
               ELEMENTOS
            */

            const trigger =
                dropdown.querySelector(
                    ".user-dropdown-trigger"
                );


            const logoutButton =
                dropdown.querySelector(
                    ".user-dropdown-logout"
                );


            /*
               ABRIR / CERRAR
            */

            trigger.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    /*
                       Cerramos cualquier otro menú
                       que pudiera estar abierto.
                    */

                    document
                        .querySelectorAll(
                            ".user-dropdown.open"
                        )
                        .forEach(
                            otherDropdown => {

                                if (
                                    otherDropdown !==
                                    dropdown
                                ) {

                                    otherDropdown
                                        .classList
                                        .remove("open");

                                }

                            }
                        );


                    const isOpen =
                        dropdown.classList.toggle(
                            "open"
                        );


                    trigger.setAttribute(
                        "aria-expanded",
                        String(isOpen)
                    );

                }
            );


            /*
               CERRAR SESIÓN
            */

            if (logoutButton) {

                logoutButton.addEventListener(
                    "click",
                    logoutUser
                );

            }

        }
    );

}


/* =========================================================
   CERRAR MENÚ AL HACER CLICK FUERA
========================================================= */

document.addEventListener(
    "click",
    event => {

        document
            .querySelectorAll(
                ".user-dropdown.open"
            )
            .forEach(
                dropdown => {

                    if (
                        !dropdown.contains(
                            event.target
                        )
                    ) {

                        dropdown
                            .classList
                            .remove("open");


                        const trigger =
                            dropdown.querySelector(
                                ".user-dropdown-trigger"
                            );


                        if (trigger) {

                            trigger.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }

                    }

                }
            );

    }
);


/* =========================================================
   CERRAR MENÚ CON ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {
            return;
        }


        document
            .querySelectorAll(
                ".user-dropdown.open"
            )
            .forEach(
                dropdown => {

                    dropdown
                        .classList
                        .remove("open");


                    const trigger =
                        dropdown.querySelector(
                            ".user-dropdown-trigger"
                        );


                    if (trigger) {

                        trigger.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                }
            );

    }
);


document.addEventListener(
    "DOMContentLoaded",
    createUserDropdown
);

/* =========================================================
   MENÚ DE NOTIFICACIONES
========================================================= */
function formatNotificationTime(
    dateValue
) {

    if (!dateValue) {
        return "";
    }


    const date =
        new Date(dateValue);

    const now =
        new Date();


    const seconds =
        Math.floor(
            (now - date) / 1000
        );


    if (seconds < 60) {
        return "Ahora";
    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    if (minutes < 60) {

        return `Hace ${minutes} min`;

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return `Hace ${hours} h`;

    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days === 1) {
        return "Ayer";
    }


    return `Hace ${days} días`;
}

function createNotificationsDropdown() {

    const user =
        getCurrentSessionUser();


    if (!user) {
        return;
    }


    const userId =
        String(
            user.universityId ||
            user.id ||
            ""
        );


    if (!userId) {
        return;
    }


    const notificationButtons =
        document.querySelectorAll(
            ".notification-button"
        );


    notificationButtons.forEach(
        button => {

            /*
               Evitar inicializar dos veces.
            */

            if (
                button.dataset
                    .notificationsReady ===
                    "true"
            ) {
                return;
            }


            button.dataset
                .notificationsReady =
                "true";


            /*
               CONTENEDOR
            */

            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "notifications-dropdown";


            button.parentNode.insertBefore(
                wrapper,
                button
            );


            wrapper.appendChild(
                button
            );


            /*
               MENÚ
            */

            const menu =
                document.createElement(
                    "div"
                );


            menu.className =
                "notifications-menu";


            wrapper.appendChild(
                menu
            );


            function renderNotifications() {

                const allNotifications =
                    getNotifications();


                const userNotifications =
                    allNotifications
                        .filter(
                            notification =>

                                String(
                                    notification.userId
                                ) ===
                                userId
                        )
                        .slice(
                            0,
                            10
                        );


                const unread =
                    userNotifications.filter(
                        notification =>
                            !notification.read
                    ).length;


                /*
                   PUNTO VERDE / CONTADOR
                */

                let badge =
                    button.querySelector(
                        ".notification-count"
                    );


                if (
                    unread > 0 &&
                    !badge
                ) {

                    badge =
                        document.createElement(
                            "span"
                        );

                    badge.className =
                        "notification-count";

                    button.appendChild(
                        badge
                    );

                }


                if (badge) {

                    if (unread > 0) {

                        badge.textContent =
                            unread > 9
                                ? "9+"
                                : unread;

                        badge.style.display =
                            "flex";

                    } else {

                        badge.style.display =
                            "none";

                    }

                }


                /*
                   SIN NOTIFICACIONES
                */

                if (
                    userNotifications.length ===
                    0
                ) {

                    menu.innerHTML = `

                        <div class="notifications-header">

                            <div>
                                <strong>
                                    Notificaciones
                                </strong>

                                <span>
                                    Mantente al día con tus viajes
                                </span>
                            </div>

                        </div>


                        <div class="notifications-empty">

                            <div>
                                <i class="fa-regular fa-bell"></i>
                            </div>

                            <strong>
                                Todo al día
                            </strong>

                            <span>
                                Todavía no tienes notificaciones.
                            </span>

                        </div>

                    `;

                    return;
                }


                /*
                   LISTA
                */

                menu.innerHTML = `

                    <div class="notifications-header">

                        <div>

                            <strong>
                                Notificaciones
                            </strong>

                            <span>
                                ${
                                    unread > 0
                                        ? `${unread} sin leer`
                                        : "Todo al día"
                                }
                            </span>

                        </div>


                        ${
                            unread > 0
                                ? `
                                    <button
                                        type="button"
                                        class="mark-all-read"
                                    >
                                        Marcar leídas
                                    </button>
                                `
                                : ""
                        }

                    </div>


                    <div class="notifications-list">

                        ${userNotifications
                            .map(
                                notification => `

                                    <button
                                        type="button"
                                        class="
                                            notification-item
                                            ${
                                                notification.read
                                                    ? ""
                                                    : "unread"
                                            }
                                        "
                                        data-notification-id="${notification.id}"
                                        data-trip-id="${notification.tripId || ""}"
                                    >

                                        <div class="notification-item-icon">

                                            <i class="
                                                ${
                                                    notification.type === "request"
                                                        ? "fa-solid fa-user-plus"
                                                        : notification.type === "accepted"
                                                            ? "fa-solid fa-circle-check"
                                                            : notification.type === "rejected"
                                                                ? "fa-solid fa-circle-xmark"
                                                                : notification.type === "cancelled"
                                                                    ? "fa-solid fa-ban"
                                                                    : "fa-regular fa-bell"
                                                }
                                            "></i>

                                        </div>


                                        <div class="notification-item-content">

                                            <strong>
                                                ${notification.title}
                                            </strong>

                                            <p>
                                                ${notification.message}
                                            </p>

                                            <span>
                                                ${formatNotificationTime(
                                                    notification.createdAt
                                                )}
                                            </span>

                                        </div>


                                        ${
                                            !notification.read
                                                ? `
                                                    <span
                                                        class="notification-unread-dot"
                                                    ></span>
                                                `
                                                : ""
                                        }

                                    </button>

                                `
                            )
                            .join("")}

                    </div>

                `;


                /*
                   MARCAR TODAS COMO LEÍDAS
                */

                const markAll =
                    menu.querySelector(
                        ".mark-all-read"
                    );


                if (markAll) {

                    markAll.addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();


                            const notifications =
                                getNotifications();


                            notifications.forEach(
                                notification => {

                                    if (
                                        String(
                                            notification.userId
                                        ) ===
                                        userId
                                    ) {

                                        notification.read =
                                            true;

                                    }

                                }
                            );


                            saveNotifications(
                                notifications
                            );


                            renderNotifications();

                        }
                    );

                }


                /*
                   CLICK EN NOTIFICACIÓN
                */

                menu
                    .querySelectorAll(
                        ".notification-item"
                    )
                    .forEach(
                        item => {

                            item.addEventListener(
                                "click",
                                () => {

                                    const notificationId =
                                        item.dataset
                                            .notificationId;


                                    const tripId =
                                        item.dataset
                                            .tripId;


                                    const notifications =
                                        getNotifications();


                                    const notification =
                                        notifications.find(
                                            current =>
                                                current.id ===
                                                notificationId
                                        );


                                    if (notification) {

                                        notification.read =
                                            true;

                                        saveNotifications(
                                            notifications
                                        );

                                    }


                                    /*
                                       Las solicitudes del conductor
                                       conviene abrirlas en Mis viajes.

                                       Las demás pueden abrir el viaje.
                                    */

                                    if (
                                        notification &&
                                        notification.type ===
                                            "request"
                                    ) {

                                        window.location.href =
                                            "mis-viajes.html";

                                        return;
                                    }

                                    if (
                                        notification &&
                                        notification.type ===
                                            "cancelled"
                                    ) {

                                        window.location.href =
                                            "mis-viajes.html?tab=cancelled";

                                        return;
                                    }


                                    if (tripId) {

                                        window.location.href =
                                            `viaje.html?id=${encodeURIComponent(tripId)}`;

                                    } else {

                                        window.location.href =
                                            "mis-viajes.html";

                                    }

                                }
                            );

                        }
                    );

            }


            /*
               ABRIR CAMPANA
            */

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    /*
                       Cerrar menú de usuario.
                    */

                    document
                        .querySelectorAll(
                            ".user-dropdown.open"
                        )
                        .forEach(
                            dropdown =>
                                dropdown
                                    .classList
                                    .remove("open")
                        );


                    wrapper.classList.toggle(
                        "open"
                    );


                    renderNotifications();

                }
            );


            renderNotifications();

        }
    );

}

/* =========================================================
   INICIALIZAR NOTIFICACIONES
========================================================= */

createNotificationsDropdown();

/* =========================================================
   INICIO DE SESIÓN
========================================================= */

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const universityId =
                document
                    .getElementById(
                        "loginId"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            /*
               VALIDAR CAMPOS
            */

            if (
                !universityId ||
                !password
            ) {

                alert(
                    "Ingresa tu ID universitario y contraseña."
                );

                return;
            }


            /*
               OBTENER USUARIOS REGISTRADOS
            */

            const users =
                getRegisteredUsers();


            /*
               BUSCAR CUENTA POR ID
            */

            const user =
                users.find(
                    registeredUser =>

                        String(
                            registeredUser.universityId
                        ) ===
                        String(
                            universityId
                        )
                );


            /*
               CUENTA NO ENCONTRADA
            */

            if (!user) {

                alert(
                    "No existe una cuenta con este ID universitario."
                );

                return;
            }


            /*
               VALIDAR CONTRASEÑA
            */

            if (
                String(user.password) !==
                String(password)
            ) {

                alert(
                    "La contraseña es incorrecta."
                );

                return;
            }


            /*
               INICIAR SESIÓN
            */

            setCurrentUser(
                user
            );


            /*
               IR AL DASHBOARD
            */

            window.location.href =
                "dashboard.html";

        }
    );

}


/* =========================================================
   REGISTRO DE USUARIOS
========================================================= */

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "registerName"
                    )
                    .value
                    .trim();


            const lastName =
                document
                    .getElementById(
                        "registerLastName"
                    )
                    .value
                    .trim();


            const universityId =
                document
                    .getElementById(
                        "registerId"
                    )
                    .value
                    .trim();


            const sex =
                document
                    .getElementById(
                        "registerSex"
                    )
                    .value;


            const email =
                document
                    .getElementById(
                        "registerEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById(
                        "registerPassword"
                    )
                    .value;


            /*
               VALIDACIONES
            */

            if (
                !name ||
                !lastName ||
                !universityId ||
                !sex ||
                !email ||
                !password
            ) {

                alert(
                    "Completa todos los campos."
                );

                return;
            }


            if (password.length < 8) {

                alert(
                    "La contraseña debe tener al menos 8 caracteres."
                );

                return;
            }


            /*
               OBTENER CUENTAS EXISTENTES
            */

            const users =
                getRegisteredUsers();


            /*
               EVITAR ID DUPLICADO
            */

            const idAlreadyExists =
                users.some(
                    user =>
                        String(
                            user.universityId
                        ) ===
                        String(
                            universityId
                        )
                );


            if (idAlreadyExists) {

                alert(
                    "Ya existe una cuenta con este ID universitario."
                );

                return;
            }


            /*
               EVITAR CORREO DUPLICADO
            */

            const emailAlreadyExists =
                users.some(
                    user =>
                        String(
                            user.email || ""
                        ).toLowerCase() ===
                        email
                );


            if (emailAlreadyExists) {

                alert(
                    "Ya existe una cuenta con este correo electrónico."
                );

                return;
            }


            /*
               CREAR USUARIO
            */

            const newUser = {

                id:
                    universityId,

                universityId:
                    universityId,

                name:
                    name,

                lastName:
                    lastName,

                sex:
                    sex,

                email:
                    email,

                password:
                    password,

                createdAt:
                    new Date()
                        .toISOString()

            };


            /*
               GUARDAR EN LISTA DE CUENTAS
            */

            users.push(
                newUser
            );


            saveRegisteredUsers(
                users
            );


            /*
               INICIAR SESIÓN AUTOMÁTICAMENTE
            */

            setCurrentUser(
                newUser
            );


            /*
               IR AL DASHBOARD
            */

            window.location.href =
                "dashboard.html";

        }
    );

}

/* =========================================================
   SISTEMA DE NOTIFICACIONES
========================================================= */

function getNotifications() {

    try {

        const stored =
            localStorage.getItem(
                NOTIFICATIONS_STORAGE_KEY
            );

        return stored
            ? JSON.parse(stored)
            : [];

    } catch (error) {

        console.error(
            "No fue posible cargar las notificaciones:",
            error
        );

        return [];
    }
}


function saveNotifications(
    notifications
) {

    localStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(
            notifications
        )
    );

}


function createNotification({
    userId,
    type,
    title,
    message,
    tripId = null
}) {

    if (!userId) {
        return;
    }


    const notifications =
        getNotifications();


    notifications.unshift({

        id:
            "NOT-" + Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2, 7),

        userId:
            String(userId),

        type:
            type || "general",

        title:
            title || "Notificación",

        message:
            message || "",

        tripId:
            tripId,

        read:
            false,

        createdAt:
            new Date()
                .toISOString()

    });


    saveNotifications(
        notifications
    );

}


/*
   La exponemos globalmente porque
   viaje.js y mis-viajes.js la utilizarán.
*/

window.createNotification =
    createNotification;


/* =========================================================
   FECHA DEL DASHBOARD
========================================================= */

const dashboardDate =
    document.getElementById("dashboardDate");


if (dashboardDate) {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");


    const formattedDate =
        `${year}-${month}-${day}`;


    dashboardDate.min =
        formattedDate;

    dashboardDate.value =
        formattedDate;

}


/* =========================================================
   BUSCADOR DEL DASHBOARD
========================================================= */

const dashboardSearch =
    document.getElementById("dashboardSearch");


if (dashboardSearch) {

    dashboardSearch.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const origin =
                document.getElementById(
                    "dashboardOrigin"
                ).value;


            const destination =
                document.getElementById(
                    "dashboardDestination"
                ).value;


            const date =
                document.getElementById(
                    "dashboardDate"
                ).value;


            /*
                Mandamos los datos mediante parámetros
                para utilizarlos posteriormente en
                buscar.html
            */

            const parameters =
                new URLSearchParams({

                    origin: origin,

                    destination: destination,

                    date: date

                });


            window.location.href =
                `buscar.html?${parameters.toString()}`;

        }
    );

}

/* =========================================================
   VIAJES REALES EN DASHBOARD
========================================================= */

function renderDashboardTrips() {

    const grid =
        document.getElementById(
            "dashboardTripsGrid"
        );

    if (!grid) {
        return;
    }


    let trips = [];

    try {

        trips =
            JSON.parse(
                localStorage.getItem(
                    "uaaventon_trips"
                )
            ) || [];

    } catch (error) {

        console.error(
            "No fue posible cargar los viajes:",
            error
        );

        trips = [];

    }


    /* =====================================================
       USUARIO ACTUAL
    ====================================================== */

    let currentUserId = "";

    try {

        const storedUser =
            JSON.parse(
                localStorage.getItem(
                    "uaaventonUser"
                )
            );

        if (storedUser) {

            currentUserId =
                String(
                    storedUser.universityId ||
                    storedUser.id ||
                    ""
                );

        }

    } catch (error) {

        console.error(
            "No fue posible obtener al usuario:",
            error
        );

    }


    /* =====================================================
       FILTRAR VIAJES DISPONIBLES
    ====================================================== */

    const availableTrips =
        trips
            .filter(trip => {

                const seats =
                    Number(
                        trip.availableSeats ??
                        trip.seats ??
                        0
                    );

                return (
                    trip.role === "driver" &&
                    trip.status !== "cancelled" &&
                    trip.status !== "finished" &&
                    trip.status !== "in_progress" &&
                    seats > 0 &&
                    String(
                        trip.driverId || ""
                    ) !== currentUserId
                );

            })
            .sort((a, b) => {

                const dateA =
                    new Date(
                        `${a.date || "9999-12-31"}T${a.time || "23:59"}`
                    );

                const dateB =
                    new Date(
                        `${b.date || "9999-12-31"}T${b.time || "23:59"}`
                    );

                return dateA - dateB;

            })
            .slice(0, 3);


    /* =====================================================
       SIN VIAJES
    ====================================================== */

    if (availableTrips.length === 0) {

        grid.innerHTML = `

            <div class="dashboard-no-trips">

                <i class="fa-solid fa-route"></i>

                <h3>
                    No hay viajes disponibles por ahora
                </h3>

                <p>
                    Cuando otros estudiantes publiquen
                    viajes, aparecerán aquí.
                </p>

                <a
                    href="buscar.html"
                    class="btn btn-primary"
                >
                    Buscar viajes
                </a>

            </div>

        `;

        return;

    }


    /* =====================================================
       CREAR TARJETAS
    ====================================================== */

    grid.innerHTML =
        availableTrips
            .map(trip => {

                const seats =
                    Number(
                        trip.availableSeats ??
                        trip.seats ??
                        0
                    );


                const driverName =
                    trip.driverName ||
                    "Estudiante UAA";


                const initials =
                    driverName
                        .trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map(
                            word =>
                                word
                                    .charAt(0)
                                    .toUpperCase()
                        )
                        .join("") || "UA";


                const vehicle =
                    trip.vehicle ||
                    (
                        trip.vehicleInfo
                            ? `${trip.vehicleInfo.brand || ""} ${trip.vehicleInfo.model || ""}`.trim()
                            : ""
                    ) ||
                    "Vehículo registrado";


                let dateText =
                    trip.date ||
                    "Sin fecha";


                if (trip.date) {

                    const tripDate =
                        new Date(
                            `${trip.date}T12:00:00`
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


                    if (
                        tripDate.toDateString() ===
                        today.toDateString()
                    ) {

                        dateText =
                            "Hoy";

                    } else if (
                        tripDate.toDateString() ===
                        tomorrow.toDateString()
                    ) {

                        dateText =
                            "Mañana";

                    } else {

                        dateText =
                            new Intl.DateTimeFormat(
                                "es-MX",
                                {
                                    day: "numeric",
                                    month: "short"
                                }
                            ).format(
                                tripDate
                            );

                    }

                }


                return `

                    <article class="trip-card">

                        <div class="trip-card-top">

                            <span class="trip-status active">

                                <span></span>

                                Disponible

                            </span>

                            <span class="trip-date">
                                ${dateText}
                            </span>

                        </div>


                        <div class="trip-route">

                            <div class="trip-route-icons">

                                <span class="route-origin"></span>

                                <div></div>

                                <span class="route-destination"></span>

                            </div>


                            <div class="trip-route-data">

                                <div>

                                    <span>
                                        ${trip.time || "--:--"}
                                    </span>

                                    <div>

                                        <small>
                                            ORIGEN
                                        </small>

                                        <strong>
                                            ${trip.origin || "UAA"}
                                        </strong>

                                    </div>

                                </div>


                                <div>

                                    <span>
                                        —
                                    </span>

                                    <div>

                                        <small>
                                            DESTINO
                                        </small>

                                        <strong>
                                            ${trip.destination || "Sin destino"}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>


                        <div class="trip-driver-row">

                            <div class="trip-driver">

                                <div class="trip-avatar">
                                    ${initials}
                                </div>

                                <div>

                                    <strong>
                                        ${driverName}
                                    </strong>

                                    <span class="trip-rating">

                                        <i class="fa-solid fa-user-check"></i>

                                        Estudiante UAA

                                    </span>

                                </div>

                            </div>


                            <div class="trip-price-large">

                                <small>
                                    POR PERSONA
                                </small>

                                <strong>
                                    $${trip.price ?? 0}
                                </strong>

                            </div>

                        </div>


                        <div class="trip-information">

                            <span>

                                <i class="fa-solid fa-car"></i>

                                ${vehicle}

                            </span>

                            <span>

                                <i class="fa-solid fa-user-group"></i>

                                ${seats}
                                ${
                                    seats === 1
                                        ? "lugar"
                                        : "lugares"
                                }

                            </span>

                        </div>


                        <a
                            href="viaje.html?id=${encodeURIComponent(trip.id)}"
                            class="trip-view-button"
                        >

                            Ver viaje

                            <i class="fa-solid fa-arrow-right"></i>

                        </a>

                    </article>

                `;

            })
            .join("");

}


/* =========================================================
   INICIALIZAR VIAJES DEL DASHBOARD
========================================================= */

renderDashboardTrips();
