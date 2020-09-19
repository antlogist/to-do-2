const dayPlan = {
    todoTasks: [
        {
            id: 1600089931686,
            name: "Create HTML template"
        },
        {
            id: 1600089931190,
            name: "Update WordPress"
        },
        {
            id: 1600089930621,
            name: "Learn Udemy Courses"
        }
    ]
};

(function todo() {
    // Check the day plan
    if (typeof dayPlan === "undefined" || !Array.isArray(dayPlan.todoTasks)) {
        console.error("Tasks are not available");
        return;
    }

    const todoTasksContainer = document.getElementById("todoTasks");
    const sectionTitleWrapper = document.getElementById("sectionTitleWrapper");
    const addTodoButton = document.getElementById("addTodo");
    const selectThemeButton = document.getElementById("themeSelectButton");
    const themeSelection = document.getElementById("themeSelect");
    const weatherEl = document.getElementById("weather");

    todoTasksRender(dayPlan);

    // Todo tasks render
    function todoTasksRender({ todoTasks } = {}) {
        if (!todoTasks) {
            return;
        }
        todoTasksContainer.innerHTML = "";
        todoTasks.map(task => {
            todoTasksContainer.append(createTemplate(task));
        });
    }

    // Template
    function createTemplate(task) {
        const fragment = document.createDocumentFragment();
        const div = document.createElement("div");
        div.setAttribute("id", `todoInputGroup${task.id}`);
        div.classList.add("input-group", "mb-3");
        const template = `
            <div class="input-group-prepend">
                <div class="input-group-text">
                    <input type="checkbox" />
                </div>
            </div>
            <input id="todoInput${task.id}" value="${task.name}" type="text" class="form-control todo-input" data-id="${task.id}" />
            <div class="input-group-append">
                <button class="btn btn-sm btn-primary btn-down py-0 my-0" id="downBtn${task.id}" data-id="${task.id}">&#8595;</button>

                <button class="btn btn-sm btn-primary btn-up py-0 my-0" id="upBtn${task.id}" data-id="${task.id}">&#8593;</button>

                <button class="btn btn-sm btn-primary btn-delete py-0 my-0 mr-2" id="deleteBtn${task.id}" data-id="${task.id}">x</button>
            </div>`;
        div.insertAdjacentHTML("afterbegin", template);
        fragment.appendChild(div);
        return fragment;
    }

    // Menu container click
    function onSectionTitleWrapperClick(e) {
        const el = e.target;
        if (el.classList.contains("add-task-btn")) {
            addTask(e);
        }
        if (el.classList.contains("open-theme-btn")) {
            toggleClass(sectionTitleWrapper, "show-theme");
            // focus
            if (sectionTitleWrapper.classList.contains("show-theme")) {
                themeSelection.focus();
            } else {
                document.querySelector(".open-theme-btn").focus();
            }
            toggleTabInex("open-theme-btn");
        }
        if (el.classList.contains("sort-btn")) {
            sortTasks(e);
        }
        if (el.classList.contains("weather-btn")) {
            themeSelection.tabIndex = 0;
            if (!sectionTitleWrapper.classList.contains("show-weather")) {
                getWeather(e);
            }
            toggleTabInex("weather-btn");
            toggleClass(sectionTitleWrapper, "show-weather");
        }
    }

    // Keyboard
    function keyPress(e) {
        // CTRL + A
        if (e.keyCode == 65 && e.ctrlKey) {
            addTask(e);
        }
        // CTRL + Q
        if (e.keyCode == 81 && e.ctrlKey) {
            sortTasks(e);
        }
        // CTRL + B
        if (e.keyCode == 66 && e.ctrlKey) {
            themeSelection.tabIndex = 0;
            if (!sectionTitleWrapper.classList.contains("show-weather")) {
                getWeather(e);
            }
            toggleTabInex("weather-btn");
            toggleClass(sectionTitleWrapper, "show-weather");
        }
        // CTRL + M
        if (e.keyCode == 77 && e.ctrlKey) {
            toggleClass(sectionTitleWrapper, "show-theme");
            // focus
            if (sectionTitleWrapper.classList.contains("show-theme")) {
                themeSelection.focus();
            } else {
                document.querySelector(".open-theme-btn").focus();
            }
            toggleTabInex("open-theme-btn");
        }
    }

    // Tabindex toggle
    function toggleTabInex(className) {
        const el = document.querySelector(`.${className}`);
        el.tabIndex = -1;
        const arr = document.querySelectorAll(
            ".menu-buttons-wrapper .btn, #themeSelect"
        );
        arr.forEach((el, index, arr) => {
            console.log(el);
            if (el.tabIndex === -1) {
                el.tabIndex = 0;
            } else {
                el.tabIndex = -1;
            }
        });
    }

    // Sort tasks
    function sortTasks(e) {
        dayPlan.todoTasks.sort((a, b) =>
            a.name.localeCompare(b.name, "en", { sensitivity: "base" })
        );
        todoTasksRender(dayPlan);
    }

    // Add todo
    function addTask(e) {
        const task = {
            id: new Date().valueOf(),
            name: ""
        };
        // object manipulation
        dayPlan.todoTasks.unshift(task);
        // DOM manipulation
        const id = `todoInput${task.id}`;
        const length = dayPlan.todoTasks.length;
        todoTasksContainer.prepend(createTemplate(dayPlan.todoTasks[0]));
        document.getElementById(id).focus();
    }

    // Show theme
    function toggleClass(el, className) {
        if (el.classList.contains(className)) {
            el.classList.remove(className);
            return;
        }
        el.classList.add(className);
    }

    // Themes
    const themes = {
        coral: {
            "--primary": "coral"
        },
        pink: {
            "--primary": "pink"
        },
        lightblue: {
            "--primary": "lightblue"
        }
    };

    // Theme selection
    function onThemeSelection() {
        setTheme(themeSelection.value);
    }
    // Set theme
    function setTheme(themeName) {
        const theme = themes[themeName];
        Object.entries(theme).forEach(([key, value], index, arr) => {
            document.documentElement.style.setProperty(key, value);
        });
    }

    // Todo container click
    function onTodoContainerClick(e) {
        const el = e.target;
        const elId = el.id;
        // Delete button
        if (el.classList.contains("btn-delete")) {
            deleteTask(el);
        }
        // Down button
        if (el.classList.contains("btn-down")) {
            // check if it is not the last button
            const arr = document.querySelectorAll(".btn-down");
            const length = arr.length;
            const lastElId = arr[length - 1].id;
            if (lastElId === elId) {
                return;
            }
            downTask(el);
        }
        // Up button
        if (el.classList.contains("btn-up")) {
            // check if it is not the first button
            const arr = document.querySelectorAll(".btn-up");
            const firstElId = arr[0].id;
            if (firstElId === elId) {
                return;
            }
            upTask(el);
        }
    }

    // Delete todo
    function deleteTask(el) {
        dayPlan.todoTasks.some(({ id, name }, index, arr) => {
            if (el.dataset.id == id) {
                if (window.confirm("Do you really want to delete this task?")) {
                    // object manipulation
                    dayPlan.todoTasks.splice(index, 1);
                    // DOM manipulation
                    el.closest(".input-group").remove();
                }
            }
            return +el.dataset.id === id;
        });
    }

    // Replace Dom elements
    function replaceEls(parent, elOneId, elTwoId) {
        const elOne = document.getElementById(elOneId);
        const elTwo = document.getElementById(elTwoId);
        parent.insertBefore(elTwo, elOne);
    }

    // Down task
    function downTask(el) {
        [...dayPlan.todoTasks].some(({ id, name }, index, arr) => {
            if (+el.dataset.id === id) {
                // object manipulation
                let objA = arr[index + 1];
                let objB = arr[index];
                dayPlan.todoTasks[index] = objA;
                dayPlan.todoTasks[index + 1] = objB;
                // DOM manipulation
                replaceEls(
                    todoTasksContainer,
                    `todoInputGroup${objB.id}`,
                    `todoInputGroup${objA.id}`
                );
                // Animation classes
                const upId = "todoInputGroup" + dayPlan.todoTasks[index].id;
                const downId =
                    "todoInputGroup" + dayPlan.todoTasks[index + 1].id;
                animation(upId, downId);
            }
            return +el.dataset.id === id;
        });
    }

    // Up task
    function upTask(el) {
        [...dayPlan.todoTasks].some(({ id, name }, index, arr) => {
            if (+el.dataset.id === id) {
                // object manipulation
                let objA = arr[index];
                let objB = arr[index - 1];
                [objA, objB] = [objB, objA];
                dayPlan.todoTasks[index] = objA;
                dayPlan.todoTasks[index - 1] = objB;
                // DOM manipulation
                replaceEls(
                    todoTasksContainer,
                    `todoInputGroup${objA.id}`,
                    `todoInputGroup${objB.id}`
                );
                // Animation classes
                const upId = "todoInputGroup" + dayPlan.todoTasks[index - 1].id;
                const downId = "todoInputGroup" + dayPlan.todoTasks[index].id;
                animation(upId, downId);
            }
            return +el.dataset.id === id;
        });
    }

    // Animation
    function animation(downId, upId) {
        addClass([downId, upId], ["hide"]);
        setTimeout(function add() {
            addClass([downId], ["down"]);
            addClass([upId], ["up"]);
        }, 100);
        setTimeout(function remove() {
            removeClass([downId, upId], ["hide", "down", "up"]);
        }, 350);
    }

    // On todo inputs change
    function todoInputChange(e) {
        const el = e.target;
        dayPlan.todoTasks.some(({ id, name }, index, arr) => {
            if (+el.dataset.id === id) {
                // object manipulation
                dayPlan.todoTasks[index].name = el.value;
            }
            return +el.dataset.id === id;
        });
    }

    // Container events listener
    function eventListeners() {
        // Todo button listener
        themeSelection.addEventListener("change", onThemeSelection);
        sectionTitleWrapper.addEventListener(
            "click",
            onSectionTitleWrapperClick
        );
        todoTasksContainer.addEventListener("click", onTodoContainerClick);
        todoTasksContainer.addEventListener("input", todoInputChange);
        //keyboard
        document.addEventListener("keydown", keyPress);
    }

    eventListeners();

    // Add class
    function addClass(id, className) {
        id.forEach(id => {
            const el = document.getElementById(id);
            className.forEach(className => {
                el.classList.add(className);
            });
        });
    }

    // Remove class
    function removeClass(id, className) {
        id.forEach(id => {
            const el = document.getElementById(id);
            className.forEach(className => {
                el.classList.remove(className);
            });
        });
    }

    /* WEATHER */

    // Render weather
    function renderWeather(obj) {
        weatherEl.innerHTML = "";
        const fragment = document.createDocumentFragment();
        const div = document.createElement("div");
        const template =
            obj && typeof obj === "object"
                ? `${obj.main.temp} &deg;C <img src="${obj.weather[0].icon}"></img>`
                : `please, try again later`;
        div.insertAdjacentHTML("afterbegin", template);
        fragment.appendChild(div);
        weatherEl.appendChild(fragment);
    }

    // Get weather
    function getWeather() {
        const geo = getGeo();
        let respObj = null;
        const weatherAPI = "https://fcc-weather-api.glitch.me/api/";
        const httpRequest = getHttpRequest();

        // Get coordinates
        function getGeo() {
            return {
                succes(position) {
                    const lat = Number(position.coords.latitude.toFixed(2));
                    const lon = Number(position.coords.longitude.toFixed(2));
                    httpRequest.get(
                        `${weatherAPI}current?lat=${lat}&lon=${lon}`,
                        (err, resp) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            // Check the answer from the server
                            const lonResp = resp.coord.lon;
                            if (resp.coord.lon === lon) {
                                renderWeather(resp);
                            } else {
                                renderWeather(null);
                            }
                        }
                    );
                },
                error() {
                    console.error("Unable to retrieve your location");
                },
                options: {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            };
        }

        // If browser doesn't support geolocation
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by your browser");
            return;
        } else {
            navigator.geolocation.getCurrentPosition(
                geo.succes,
                geo.error,
                geo.options
            );
        }

        // http get method
        function getHttpRequest() {
            return {
                get(url, cb) {
                    try {
                        // xhr object
                        const xhr = new XMLHttpRequest();
                        // xhr open
                        xhr.open("GET", url);
                        // xhr load
                        xhr.addEventListener("load", () => {
                            if (Math.floor(xhr.status / 100) !== 2) {
                                cb(`Error. Status code ${xhr.status}`, xhr);
                                return;
                            }
                            // parse
                            const response = JSON.parse(xhr.responseText);
                            respObj = response;
                            // callback
                            cb(null, respObj);
                        });
                        // xhr error
                        xhr.addEventListener("error", () => {
                            console.log("error");
                        });
                        // xhr send
                        xhr.send();
                    } catch (error) {
                        console.log(error);
                    }
                }
            };
        }
    }
})();
