    }
// TaskPilotAI - Fixed to match index.html
let currentTask = null;
let balance = parseInt(localStorage.getItem('balance') || localStorage.getItem('tp_balance') || '0');
let history = JSON.parse(localStorage.getItem('tp_history') || '[]');

document.addEventListener('DOMContentLoaded', () => {
  updateBalance();
});

function updateBalance() {
  const el = document.getElementById('balance');
  if (el) el.textContent = '$' + (balance/100).toFixed(2);
  localStorage.setItem('balance', balance);
  localStorage.setItem('tp_balance', balance);
}

function openTask(title, platform, reward, link) {
  currentTask = { title, platform, reward: parseFloat(reward)*100, link };
  if (link) window.open(link, '_blank');
  const modal = document.getElementById('taskModal');
  if (modal) modal.style.display = 'flex';
  const proofInput = document.getElementById('proof');
  const userInput = document.getElementById('username');
  if (proofInput) proofInput.value = '';
  if (userInput) userInput.value = '';
}

function closeTask() {
  const modal = document.getElementById('taskModal');
  if (modal) modal.style.display = 'none';
  currentTask = null;
}

function submitProof() {
  const proofEl = document.getElementById('proof');
  const userEl = document.getElementById('username');
  
  if (!proofEl || !proofEl.files[0]) {
    alert('Please upload screenshot proof!');
    return;
  }
  if (!userEl || !userEl.value.trim()) {
    alert('Please enter your Instagram/Facebook username!');
    return;
  }
  if (!currentTask) {
    alert('Please select a task first!');
    return;
  }
  
  balance += currentTask.reward;
  updateBalance();
  
  history.push({
    title: currentTask.title,
    reward: currentTask.reward,
    username: userEl.value,
    date: new Date().toLocaleString()
  });
  localStorage.setItem('tp_history', JSON.stringify(history));
  
  alert(`Success! ${currentTask.title} submitted!\n$${(currentTask.reward/100).toFixed(2)} added to balance.`);
  closeTask();
}

window.onclick = function(e) {
  const modal = document.getElementById('taskModal');
  if (e.target == modal) closeTask();
}
