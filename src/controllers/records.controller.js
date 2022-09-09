import db from "../database/db.js";
import dayjs from "dayjs";
import joi from "joi";

const recordSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required().trim(),
});

async function get(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).send({ message: "Envie um token valido" });

  const session = await db.collection("sessions").findOne({ token });

  if (!session) return res.status(401).send({ message: "Session invalida" });

  const user = await db.collection("users").findOne({
    _id: session.userId,
  });

  if (!user) return res.status(401).send({ message: "Usuário não encontrado" });
  delete user.password;

  const record = await db
    .collection("records")
    .find({ userId: user._id })
    .toArray();
  const records = { name: user.name, records: record };
  res.send(records).status(200);
}

async function create(req, res) {
  const { authorization } = req.headers;
  const { value, description } = req.body;
  const token = authorization?.replace("Bearer ", "");
  const validation = recordSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const error = validation.error.details.map((erro) => erro.message);
    res.status(422).send(error);
    return;
  }

  const session = await db.collection("sessions").findOne({ token });

  if (!session) return res.sendStatus(401);

  const user = await db.collection("users").findOne({
    _id: session.userId,
  });

  if (!user) return res.sendStatus(401);

  try {
    await db.collection("records").insertOne({
      userId: user._id,
      value: Number(value.toFixed(2)),
      description,
      date: dayjs().format("DD/MM"),
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
}
export { get, create };
