// Load transactions from localStorage on page load
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentType = 'income';
let filterType = 'all';

// Handle transaction type selection (Income/Expense)
document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentType = this.dataset.type;
  });
});

// Handle form submission
document.getElementById('transactionForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  
  const transaction = {
    id: Date.now(),
    type: currentType,
    description,
    amount,
    category,
    date: new Date().toLocaleDateString('en-IN')
  };
  
  transactions.unshift(transaction);
  
  this.reset();
  updateUI();
});

// Handle filter button cycling
document.getElementById('filterBtn').addEventListener('click', function() {
  const filters = ['all', 'income', 'expense'];
  const currentIndex = filters.indexOf(filterType);
  filterType = filters[(currentIndex + 1) % filters.length];
  
  this.textContent = filterType.charAt(0).toUpperCase() + filterType.slice(1);
  updateUI();
});

// Delete transaction function
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateUI();
}

// Update UI with current transaction data
function updateUI() {
  // Calculate totals
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Update stat cards
  document.getElementById('totalIncome').textContent = `₹${totalIncome.toLocaleString('en-IN')}`;
  document.getElementById('totalExpense').textContent = `₹${totalExpense.toLocaleString('en-IN')}`;
  document.getElementById('balance').textContent = `₹${balance.toLocaleString('en-IN')}`;

  // Filter transactions based on current filter
  const filtered = filterType === 'all'
    ? transactions
    : transactions.filter(t => t.type === filterType);

  const list = document.getElementById('transactionsList');
  const emptyState = document.getElementById('emptyState');

  // Display transactions or empty state
  if (filtered.length === 0) {
    list.innerHTML = "";
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    list.innerHTML = filtered
      .map((t, i) => `
        <div class="transaction-item" style="animation-delay: ${i * 0.1}s">
          <div class="transaction-icon ${t.type}">${t.category.split(' ')[0]}</div>
          <div class="transaction-details">
            <div class="transaction-name">${t.description}</div>
            <div class="transaction-category">${t.category} • ${t.date}</div>
          </div>
          <div class="transaction-amount ${t.type}">
            ${t.type === 'income' ? '+' : '-'}₹${t.amount.toLocaleString('en-IN')}
          </div>
          <button class="delete-btn" onclick="deleteTransaction(${t.id})">🗑️</button>
        </div>
      `)
      .join('');
  }
  
  // Save transactions to localStorage whenever UI updates
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize UI on page load
updateUI();
