export async function fetchEmbedConfig() {
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
