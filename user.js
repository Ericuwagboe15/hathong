/* ----------------------------
   ERICAS BANK — FULL LOGIC (UPDATED)
----------------------------- */

const txBody = document.getElementById("txBody");
const filterRange = document.getElementById("filterRange");

let balance = 1000; // starting balance in dollars
let transactions = [];

// Utility: format money
const formatMoney = (value) => {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  return `${sign}$${abs.toFixed(2)}`;
};

// Format date YYYY-MM-DD
const isoDate = (d) => d.toISOString().split("T")[0];

// Show logged-in user's name in welcome message
const storedUser = JSON.parse(localStorage.getItem("ericas_user"));
const welcomeMsg = document.getElementById("welcomeMsg");
if (storedUser && welcomeMsg) {
  welcomeMsg.textContent = `Welcome, ${storedUser.name}`;
}

// Generate sample transactions (last month → today)
function generateSampleTransactions() {
  const now = new Date();
  const txList = [];

  const samples = [
    ["Salary", 1500],
    ["Groceries", -45],
    ["Electricity Bill", -120],
    ["Snacks & Drinks", -12],
    ["Refund", 30],
    ["Restaurant", -60],
    ["Transfer from Alice", 40],
    ["Subscription", -9.99],
  ];

  samples.forEach((s, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (28 - i * 3));

    txList.push({
      date: isoDate(d),
      desc: s[0],
      amount: s[1],
      status: "completed"
    });

    balance += s[1]; // Add sample amount to balance
  });

  return txList;
}

// Update balances on UI
function updateBalances() {
  const pendingSum = transactions
    .filter(tx => tx.status === "pending")
    .reduce((a, b) => a + b.amount, 0);

  document.getElementById("currentBalance").textContent = balanceHidden ? "******" : formatMoney(balance);
  document.getElementById("availableBalance").textContent = balanceHidden ? "******" : formatMoney(balance - pendingSum);
}

// Display all transactions
function renderTransactions() {
  txBody.innerHTML = "";

  const range = filterRange.value;
  const now = new Date();

  const filtered = transactions.filter(tx => {
    if (range === "all") return true;
    const limit = parseInt(range);
    const daysOld = (now - new Date(tx.date)) / (1000 * 60 * 60 * 24);
    return daysOld <= limit;
  });

  filtered
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach(tx => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${tx.date}</td>
        <td>${tx.desc}</td>
        <td class="tx-amount ${tx.amount < 0 ? "negative" : "positive"}">
            ${formatMoney(tx.amount)}
        </td>
        <td>
          <span class="status ${tx.status}">
            ${tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
          </span>
        </td>
      `;

      txBody.appendChild(row);
    });
}

// ---------------------------
// SEND MONEY — UPDATED
// ---------------------------
document.getElementById("sendForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const recipient = document.getElementById("recipient").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const note = document.getElementById("note").value.trim();

  if (!recipient || amount <= 0) {
    alert("Please enter all fields correctly.");
    return;
  }

  if (amount > balance) {
    alert("Insufficient funds.");
    return;
  }

  // Immediately deduct from current balance
  balance -= amount;

  // Create pending transaction
  const tx = {
    date: isoDate(new Date()),
    desc: `To ${recipient}${note ? " — " + note : ""}`,
    amount: -amount,
    status: "pending"
  };

  transactions.unshift(tx);

  updateBalances();
  renderTransactions();

  this.reset();
  alert("Transfer created and deducted from your balance. Status: Pending.");
});

// ---------------------------
// BALANCE TOGGLE
// ---------------------------
let balanceHidden = false;
const toggleBtn = document.getElementById("toggleBalance");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    balanceHidden = !balanceHidden;
    updateBalances();
    toggleBtn.textContent = balanceHidden ? "Show Balance" : "Hide Balance";
  });
}

// ---------------------------
// FILTER RANGE
// ---------------------------
filterRange.addEventListener("change", renderTransactions);

// ---------------------------
// INIT APP
// ---------------------------
function init() {
  transactions = generateSampleTransactions();
  updateBalances();
  renderTransactions();
}

init();