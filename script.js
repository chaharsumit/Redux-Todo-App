let root = document.querySelector("ul");
let inputText = document.getElementById("text");

let all = document.querySelector(".all");
let active = document.querySelector(".active");
let completed = document.querySelector(".completed");
let clear = document.querySelector(".clear");

let todosStore = Redux.createStore(todoReducer);
let allTodos = todosStore.getState();
let activeSelectedStore = Redux.createStore(selectReducer);
let filteredTodos = activeSelectedStore.getState();
let defaultSelected = 'all';

// Event listeners

inputText.addEventListener("keyup", event => {
  if (event.key === "Enter" && event.target.value !== "") {
    todosStore.dispatch({
      type: "addTodo",
      todo: { name: event.target.value, isDone: false }
    });
    inputText.value = "";
  } else {
    return;
  }
});

clear.addEventListener("click", () => {
  todosStore.dispatch({ type: "clear" });
});

active.addEventListener("click", () => {
  activeSelectedStore.dispatch({ type: "active" });
});

completed.addEventListener("click", () => {
  activeSelectedStore.dispatch({ type: "completed" });
});

all.addEventListener("click", () => {
  activeSelectedStore.dispatch({ type: "all" });
});

function handleToggle(event) {
  todosStore.dispatch({ type: "toggleTodo", id: event.target.dataset.id });
}

function handleDelete(event) {
  todosStore.dispatch({ type: "deleteTodo", id: event.target.dataset.id });
}

// Event listeners

// subscriptions

todosStore.subscribe(() => {
  allTodos = todosStore.getState();
  createUI(allTodos, root);
});

activeSelectedStore.subscribe(() => {
  filteredTodos = activeSelectedStore.getState();
  createUI(filteredTodos, root);
});

// subscriptions

// Reducers

function selectReducer(state = [], action) {
  switch (action.type) {
    case "active":
      activeTab = 'active';
      return allTodos.filter(todo => !todo.isDone);
    case "completed":
      activeTab = 'completed';
      return allTodos.filter(todo => todo.isDone);
    default:
      activeTab = 'all';
      return allTodos;
  }
}

function todoReducer(state = [], action) {
  switch (action.type) {
    case "addTodo":
      state.push(action.todo);
      return state;
    case "toggleTodo":
      state[action.id].isDone = !state[action.id].isDone;
      return state;
    case "deleteTodo":
      state.splice(action.id, 1);
      return state;
    case "clear":
      return state.filter(todo => !todo.isDone);
    default:
      return state;
  }
}

// Reducers

function createUI(data = allTodos, rootElm = root) {
  console.log(allTodos, filteredTodos);
  rootElm.innerHTML = "";
  data.forEach((todo, index) => {
    let li = document.createElement("li");
    let input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("name", "checkbox");
    input.setAttribute("data-id", index);
    input.addEventListener("change", handleToggle);
    input.checked = todo.isDone;
    input.classList.add("checkbox");
    let p = document.createElement("p");
    p.classList.add("todo-text");
    p.innerText = todo.name;
    let span = document.createElement("span");
    span.classList.add("cross");
    span.innerText = "❌";
    span.setAttribute("data-id", index);
    span.addEventListener("click", handleDelete);

    li.append(input, p, span);
    rootElm.append(li);
  });
}

createUI(allTodos, root);

/* 
active.addEventListener("click", () => {
  let notCompleted = allTodos.filter(todo => !todo.isDone);
  createUI(notCompleted);
  defaultSelected = "active";
  updateDefaultButton();
});

completed.addEventListener("click", () => {
  let completedTodos = allTodos.filter(todo => todo.isDone);
  createUI(completedTodos);
  defaultSelected = "completed";
  updateDefaultButton();
});

all.addEventListener("click", () => {
  createUI();
  defaultSelected = "all";
  updateDefaultButton();
});

function updateDefaultButton(btn = defaultSelected) {
  all.classList.remove("selected");
  active.classList.remove("selected");
  completed.classList.remove("selected");
  if (btn === "all") {
    all.classList.add("selected");
  }
  if (btn === "active") {
    active.classList.add("selected");
  }
  if (btn === "completed") {
    completed.classList.add("selected");
  }
}

updateDefaultButton();

*/
