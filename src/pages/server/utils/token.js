import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.TRANSACTION_SECRET || "clave-muy-secreta";

export function createTransactionToken(data) {
  return jwt.sign(data, SECRET_KEY, { expiresIn: "5m" }); // válido por 5 minutos
}

export function verifyTransactionToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}
