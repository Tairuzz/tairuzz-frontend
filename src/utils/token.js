export function generateClientToken(clientId) {
  return btoa(JSON.stringify({ clientId }));
}
