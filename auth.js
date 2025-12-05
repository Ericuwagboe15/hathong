/* ----------------------------
   ERICAS AUTH SYSTEM
----------------------------- */

// Save account
function saveUser(user) {
  localStorage.setItem("ericas_user", JSON.stringify(user));
}

// Get stored account
function getUser() {
  return JSON.parse(localStorage.getItem("ericas_user"));
}

// -----------------
// Sign Up
// -----------------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();

    const user = {
      name: document.getElementById("signupName").value.trim(),
      email: document.getElementById("signupEmail").value.trim(),
      password: document.getElementById("signupPassword").value.trim()
    };

    if (!user.name || !user.email || !user.password) {
      alert("Please fill all fields!");
      return;
    }

    saveUser(user);
    alert("Account created successfully!");
    window.location.href = "index.html";
  });

  // Toggle password visibility
  const toggleSignupPwd = document.getElementById("toggleSignupPwd");
  const signupPwd = document.getElementById("signupPassword");
  if (toggleSignupPwd && signupPwd) {
    toggleSignupPwd.addEventListener("click", () => {
      signupPwd.type = signupPwd.type === "password" ? "text" : "password";
    });
  }
}

// -----------------
// Login
// -----------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const stored = getUser();
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();

    if (!stored) {
      alert("No account found! Please sign up first.");
      return;
    }

    if (email === stored.email && pass === stored.password) {
      alert("Login successful!");
      localStorage.setItem("ericas_logged_in", "true");
      window.location.href = "dashboard.html";
    } else {
      alert("Incorrect email or password.");
    }
  });

  // Toggle login password visibility
  const toggleLoginPwd = document.getElementById("toggleLoginPwd");
  const loginPwd = document.getElementById("loginPassword");
  if (toggleLoginPwd && loginPwd) {
    toggleLoginPwd.addEventListener("click", () => {
      loginPwd.type = loginPwd.type === "password" ? "text" : "password";
    });
  }
}

// -----------------
// Logout
// -----------------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("ericas_logged_in");
    window.location.href = "index.html";
  });
}

// Redirect dashboard if not logged in
if (window.location.pathname.includes("dashboard.html")) {
  if (!localStorage.getItem("ericas_logged_in")) {
    alert("Please log in first!");
    window.location.href = "index.html";
  }
}