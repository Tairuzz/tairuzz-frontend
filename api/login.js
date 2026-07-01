import jwt from "jsonwebtoken";

export default async function (req, res) {
  const { email, password } = req.body;

  // Simple hardcoded user for now
  const validUser = {
    email: "admin@tairuzz.com",
    password: "password123"
  };

  if (email !== validUser.email || password !== validUser.password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Create JWT
  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return res.json({ token });
}
