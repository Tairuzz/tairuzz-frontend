export async function fetchClientConfig(clientId) {
  // Always read the real clientId from login flow
  const storedClientId = localStorage.getItem("tairuzz_client_id");

  if (!storedClientId) {
    console.error("No clientId found — user is not logged in");
    return {}; // Prevent crash
  }

  clientId = storedClientId;

  // Get auth token
  const token = localStorage.getItem("tairuzz_auth");
  if (!token) {
    console.error("No auth token found — user is not logged in");
    return {}; // Prevent crash
  }

  try {
    const response = await fetch(
      "https://tairuzz-backend-e2gjewe6f2fpewg8.ukwest-01.azurewebsites.net/api/get-client-config",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`   // ✔ correct header
        },
        body: JSON.stringify({ clientId })
      }
    );

    if (!response.ok) {
      console.error("Backend returned error:", response.status);
      return {}; // Prevent crash
    }

    const data = await response.json();
    return data ?? {}; // ✔ always return safe object

  } catch (err) {
    console.error("Failed to load client config:", err);
    return {}; // ✔ prevent React crash
  }
}
