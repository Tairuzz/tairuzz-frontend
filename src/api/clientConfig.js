import { generateClientToken } from "../utils/token";

export async function fetchClientConfig(clientId) {
  const token = generateClientToken(clientId);

  const response = await fetch(
    "https://tairuzz-backend-e2gjewe6f2fpewg8.ukwest-01.azurewebsites.net/api/get-client-config",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tairuzz-auth": token
      }
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load client config");
  }

  return await response.json();
}
