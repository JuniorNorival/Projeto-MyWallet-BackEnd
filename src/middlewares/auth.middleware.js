import db from "../database/db.js";
async function authValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  console.log(req.headers);
  if (!token) return res.status(401).send({ message: "Envie um token valido" });

  const session = await db.collection("sessions").findOne({ token });

  if (!session) return res.status(401).send({ message: "Session invalida" });

  const user = await db.collection("users").findOne({
    _id: session.userId,
  });

  if (!user) return res.status(401).send({ message: "Usuário não encontrado" });
  delete user.password;

  res.locals.user = user;
  next();
}
export { authValidation };
