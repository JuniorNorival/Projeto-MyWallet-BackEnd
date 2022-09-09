import joi from "joi";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import db from "../database/db.js";

const userSchema = joi.object({
  name: joi.string().required().trim(),
  email: joi.string().email().required().trim(),
  password: joi.string().required().trim(),
});

async function login(req, res) {
  const { email, password } = req.body;

  const user = await db.collection("users").findOne({ email: email });
  if (!user) return res.sendStatus(404);

  const comparePassword = bcrypt.compareSync(password, user.password);

  try {
    if (user && comparePassword) {
      const token = uuidv4();

      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });
      res.send(token).status(200);
      return;
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function create(req, res) {
  const { email, name, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);
  const validation = userSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const error = validation.error.details.map((erro) => erro.message);
    res.status(422).send(error);
    return;
  }
  const userExistent = await db.collection("users").findOne({ email: email });

  if (userExistent) {
    res.status(409).send({ message: "Email já cadastrado" });
    return;
  }
  try {
    await db.collection("users").insertOne({
      name,
      email,
      password: passwordHash,
    });
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}

export { login, create };
