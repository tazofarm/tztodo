function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const list = document.getElementById('todoList');
  list.innerHTML = '';

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.textContent = todo;
    li.onclick = () => removeTodo(index);
    list.appendChild(li);
  });
}

function addTodo() {
  const input = document.getElementById('todoInput');
  const value = input.value.trim();
  if (!value) return;

  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.push(value);
  localStorage.setItem('todos', JSON.stringify(todos));
  input.value = '';
  loadTodos();
}

function removeTodo(index) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.splice(index, 1);
  localStorage.setItem('todos', JSON.stringify(todos));
  loadTodos();
}

function clearTodos() {
  localStorage.removeItem('todos');
  loadTodos();
}

function toggleSettings() {
  const panel = document.getElementById('settingsPanel');
  panel.classList.toggle('hidden');
}

function goToAddition() {
  window.location.href = '/addition';
}

window.onload = loadTodos;