import jwt from "jsonwebtoken";
export interface TokenPayload {
  userId: number;
  userName: string;
  email: string;
}
export function getUserToken(user: TokenPayload) {
  return jwt.sign(user, getTokenKey(), { expiresIn: "1h" });
}
function getTokenKey() {
  const tokenKey = process.env.TOKEN_KEY;
  if (!tokenKey) throw new Error("TOKEN KEY UNDEFINED!");
  return tokenKey;
}
export function verifyToken(token: string) {
  return jwt.verify(token, getTokenKey()) as TokenPayload;
}
