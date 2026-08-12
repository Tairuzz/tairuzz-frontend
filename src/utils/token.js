export function generateClientToken(clientId) {
  const payload = JSON.stringify({ clientId });
  return btoa(payload);
}
