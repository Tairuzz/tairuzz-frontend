export async function fetchClientConfig(clientId) {
  // Ensure clientId always exists
  if (!clientId) {
    clientId = localStorage.getItem("clientId");
    if (!clientId) {
      clientId = crypto.randomUUID();
      localStorage.setItem("clientId", clientId);
    }
  }

  // Get auth token
  const token = localStorage.getItem("tairuzz_auth");
  if (!token) {
    console.error("No auth token found in localStorage");
    return {}; // Prevent crash
  }

  try {
    const response = await fetch(
      "https://tairuzz-backend-e2gjewe6f2fpewg8.ukwest-01.azurewebsites.net/api/get-client-config",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tairuzz-auth": token   // ✔ correct header
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
