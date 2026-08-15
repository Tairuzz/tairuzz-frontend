export async function fetchEmbedConfig() {
  const res = await fetch("/api/get-embed-config", {
    headers: { "x-tairuzz-auth": localStorage.getItem("tairuzz_auth") }
  });
  if (!res.ok) throw new Error("Embed config failed");
  return res.json();
}
