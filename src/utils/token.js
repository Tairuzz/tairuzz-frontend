function generateClientToken(clientId) {
  const payload = JSON.stringify({ clientId });
  return btoa(payload); // base64 encode
}
