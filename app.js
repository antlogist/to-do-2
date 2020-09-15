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

const todoTasksContainer = document.getElementById("todoTasks");
const addTodoButton = document.getElementById("addTodo");

// Todo render
function todoTasksRender({ todoTasks } = {}) {
    if (!todoTasks) {
        return;
    }
    // Task render on first loading
    todoTasks.map(task => {
        todoTasksContainer.prepend(createTemplate(task));
    });
}

todoTasksRender(dayPlan);

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

// Add todo
function addTask(e) {
    const task = {
        id: new Date().valueOf(),
        name: ""
    };
    // object manipulation
    dayPlan.todoTasks.push(task);
    // DOM manipulation
    const id = `todoInput${task.id}`;
    const length = dayPlan.todoTasks.length;
    todoTasksContainer.prepend(createTemplate(dayPlan.todoTasks[length - 1]));
    document.getElementById(id).focus();
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
    dayPlan.todoTasks.forEach(({ id, name }, index, arr) => {
        if (el.dataset.id == id) {
            if (window.confirm("Do you really want to delete this task?")) {
                // object manipulation
                dayPlan.todoTasks.splice(index, 1);
                // DOM manipulation
                el.closest(".input-group").remove();
            }
        }
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
    [...dayPlan.todoTasks].forEach(({ id, name }, index, arr) => {
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
                `todoInputGroup${objB.id}`,
                `todoInputGroup${objA.id}`
            );
            // Animation classes
            const upId = "todoInputGroup" + dayPlan.todoTasks[index].id;
            const downId = "todoInputGroup" + dayPlan.todoTasks[index - 1].id;
            animation(upId, downId);
        }
    });
}

// Up task
function upTask(el) {
    [...dayPlan.todoTasks].forEach(({ id, name }, index, arr) => {
        if (+el.dataset.id === id) {
            // object manipulation
            let objA = arr[index];
            let objB = arr[index + 1];
            [objA, objB] = [objB, objA];
            dayPlan.todoTasks[index] = objA;
            dayPlan.todoTasks[index + 1] = objB;
            // DOM manipulation
            replaceEls(
                todoTasksContainer,
                `todoInputGroup${objA.id}`,
                `todoInputGroup${objB.id}`
            );
            // Animation classes
            const downId = "todoInputGroup" + dayPlan.todoTasks[index].id;
            const upId = "todoInputGroup" + dayPlan.todoTasks[index + 1].id;
            animation(upId, downId);
        }
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
    }, 500);
}

// Add ToDo event listener
addTodoButton.addEventListener("click", addTask);

// Container events listener
function addTodoTaskContainerListener() {
    todoTasksContainer.addEventListener("click", onTodoContainerClick);
    todoTasksContainer.addEventListener("input", todoInputChange);
}

addTodoTaskContainerListener();

// On todo inputs change
function todoInputChange(e) {
    const el = e.target;
    dayPlan.todoTasks.forEach(({ id, name }, index, arr) => {
        if (+el.dataset.id === id) {
            // object manipulation
            dayPlan.todoTasks[index].name = el.value;
        }
    });
}

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
