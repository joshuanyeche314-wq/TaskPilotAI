// TaskPilotAI - Instagram Task System
const instagramTasks = [
  {
    id: 1,
    title: "Follow on Instagram",
    type: "Follow",
    description: "Follow this page and take screenshot",
    link: "https://www.instagram.com/instagram/",
    reward: 50,
    icon: "👤"
  },
  {
    id: 2,
    title: "Like Instagram Post",
    type: "Like",
    description: "Like this post and take screenshot",
    link: "https://www.instagram.com/p/C_example1/",
    reward: 30,
    icon: "❤️"
  },
  {
    id: 3,
    title: "Comment on Post",
    type: "Comment",
    description: "Comment Nice! and take screenshot",
    link: "https://www.instagram.com/p/C_example2/",
    reward: 40,
    icon: "💬"
  }
];

let selectedTask = null;
let uploadedProof = null;
let balance = parseInt(localStorage.getItem('tp_balance') || '0');
let history = JSON.parse(localStorage.getItem('tp_history') || '[]');

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
  updateBalance();
  renderHistory();
  setupProofUpload();
});

function renderTasks() {
  const container = document.getElementById('taskList');
  if (!container) return;
  container.innerHTML = '';
  instagramTasks.forEach(task => {
    const div = document.createElement('div');
    div.className = 'task-card';
    div.innerHTML = `
      <div><b>${task.icon} ${task.title}</b><br><small>${task.description}</small><br><b>₦${task.reward}</b> | ${task.type}</div>
      <button onclick="openTask(${task.id})">Do Task</button>
    `;
    container.appendChild(div);
  });
}

function openTask(id) {
  selectedTask = instagramTasks.find(t => t.id === id);
  const detail = document.getElementById('taskDetail');
  if (detail) {
    detail.style.display = 'block';
    detail.innerHTML = `
      <h2>${selectedTask.title}</h2>
      <p>${selectedTask.description}</p>
      <a href="${selectedTask.link}" target="_blank" id="instaLink">👉 OPEN INSTAGRAM LINK</a>
      <p>Do the ${selectedTask.type}, take screenshot, come back</p>
    `;
    detail.scrollIntoView({behavior: 'smooth'});
  }
  const proofSection = document.getElementById('proofSection');
  if (proofSection) {
    proofSection.style.display = 'block';
    document.getElementById('selectedTaskId').value = selectedTask.id;
  }
}

function setupProofUpload() {
  const input = document.getElementById('proofImage');
  if (!input) return;
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadedProof = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const preview = document.getElementById('proofPreview');
      if (preview) {
        preview.src = ev.target.result;
        preview.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  });
}

function submitProof() {
  const usernameInput = document.getElementById('instaUsername');
  if (!selectedTask) { alert('Select a task first'); return; }
  if (!usernameInput ||!usernameInput.value.trim()) { alert('Enter Instagram username'); return; }
  if (!uploadedProof) { alert('Upload screenshot proof'); return; }

  const submission = {
    id: Date.now(),
    taskId: selectedTask.id,
    taskTitle: selectedTask.title,
    username: usernameInput.value.trim(),
    reward: selectedTask.reward,
    status: 'Pending',
    date: new Date().toLocaleString()
  };

  history.unshift(submission);
  localStorage.setItem('tp_history', JSON.stringify(history));
  renderHistory();
  alert('Proof submitted! Verifying...');

  setTimeout(() => {
    submission.status = 'Approved';
    balance += selectedTask.reward;
    localStorage.setItem('tp_balance', balance);
    localStorage.setItem('tp_history', JSON.stringify(history));
    updateBalance();
    renderHistory();
    alert(`Approved! ₦${selectedTask.reward} added.`);
  }, 2000);

  usernameInput.value = '';
  const preview = document.getElementById('proofPreview');
  if (preview) preview.style.display = 'none';
  uploadedProof = null;
}

function updateBalance() {
  const el = document.getElementById('userBalance');
  if (el) el.textContent = `₦${balance}`;
}

function renderHistory() {
  const el = document.getElementById('taskHistory');
  if (!el) return;
  if (history.length === 0) { el.innerHTML = '<p>No tasks yet.</p>'; return; }
  el.innerHTML = history.map(h => `<div><b>${h.taskTitle}</b> @${h.username} - ${h.status} +₦${h.reward} <small>${h.date}</small></div><hr>`).join('');
    }
