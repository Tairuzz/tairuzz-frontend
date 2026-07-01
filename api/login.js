function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Hardcoded test credentials
  const validEmail = "admin@tairuzz.com";
  const validPassword = "password123";

  if (email === validEmail && password === validPassword) {
    // Hide login section
    document.getElementById("loginSection").style.display = "none";

    // Show main content
    document.getElementById("mainContent").style.display = "block";
  } else {
    alert("Invalid credentials");
  }
}
