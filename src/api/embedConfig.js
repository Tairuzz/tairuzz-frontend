<<<<<<< HEAD
﻿export async function fetchEmbedConfig() {
=======
export async function fetchEmbedConfig() {
>>>>>>> 7e9e84f52d22046d8213e571b3df39f54c5a5727
  const token = localStorage.getItem("tairuzz_auth");
  const res = await fetch(
    "https://tairuzz-backend-e2gjewe6f2fpewg8.ukwest-01.azurewebsites.net/api/embed-config",
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  if (!res.ok) throw new Error("Embed config failed");
  return res.json();
}
