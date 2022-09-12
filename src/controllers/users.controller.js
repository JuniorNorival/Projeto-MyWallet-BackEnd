import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import db from "../database/db.js";

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
  const { email, name, password, confirmPassword } = req.body;
  /* if (password !== confirme_password) return res.sendStatus(403); */
  const passwordHash = bcrypt.hashSync(password, 10);
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
      confirmPassword,
    });
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}

export { login, create };
