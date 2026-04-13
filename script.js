// Heritage Task: Estate Productivity Logic

let tasks = JSON.parse(localStorage.getItem('heritage-task-storage')) || [];
let activeFilter = 'all';

// Selectors
const taskForm = document.getElementById('heritage-form');
const taskInput = document.getElementById('todo-input');
const categorySelect = document.getElementById('todo-category');
const taskListEl = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const progressFill = document.getElementById('progress-fill');
const efficiencyEl = document.getElementById('efficiency-percent');
const dateEl = document.getElementById('current-date');

// Initialization
function init() {
    updateDate();
    renderTasks();
    setupEventListeners();
}

function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateEl.textContent = today.toLocaleDateString('en-US', options);
}

function setupEventListeners() {
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            renderTasks();
        });
    });
}

// Logic
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
        id: Date.now(),
        text: text,
        category: categorySelect.value,
        completed: false,
        timestamp: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveAndRender();
    taskInput.value = '';
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRender();
}

function deleteTask(id) {
    const element = document.querySelector(`[data-id="${id}"]`);
    if (element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            saveAndRender();
        }, 300);
    } else {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRender();
    }
}

function updateProgress() {
    if (tasks.length === 0) {
        progressFill.style.width = '0%';
        efficiencyEl.textContent = '0% Completion';
        return;
    }

    const completedCount = tasks.filter(t => t.completed).length;
    const percentage = Math.round((completedCount / tasks.length) * 100);

    progressFill.style.width = `${percentage}%`;
    efficiencyEl.textContent = `${percentage}% Completion`;
}

// Rendering
function renderTasks() {
    taskListEl.innerHTML = '';
    
    const filtered = tasks.filter(t => {
        if (activeFilter === 'all') return true;
        return t.category === activeFilter;
    });

    if (filtered.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-state';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '4rem 0';
        emptyMsg.style.opacity = '0.3';
        emptyMsg.style.fontStyle = 'italic';
        emptyMsg.innerHTML = '<p>No objectives currently recorded in the manor ledgers.</p>';
        taskListEl.appendChild(emptyMsg);
    }

    filtered.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', task.id);
        li.style.animationDelay = `${index * 0.1}s`;

        li.innerHTML = `
            <div class="task-main">
                <div class="vintage-checkbox" onclick="toggleTask(${task.id})">
                    ${task.completed ? '<i data-lucide="check" style="width: 14px; height: 14px; color: #fff"></i>' : ''}
                </div>
                <div>
                    <span class="task-text">${escapeHtml(task.text)}</span>
                    <span class="category-badge">${task.category}</span>
                </div>
            </div>
            <div class="actions">
                <button class="del-btn" onclick="deleteTask(${task.id})" title="Remove Objective">
                    <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                </button>
            </div>
        `;

        taskListEl.appendChild(li);
    });

    updateProgress();
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function saveAndRender() {
    localStorage.setItem('heritage-task-storage', JSON.stringify(tasks));
    renderTasks();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global exposure for onclick events
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;

init();
