export default async function (req, context) {
  return {
    status: 200,
    body: JSON.stringify({ message: "Backend is working" })
  };
}
