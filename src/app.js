import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import joi from "joi";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("My-Wallet");
});

const userSchema = joi.object({
  name: joi.string().required().trim(),
  email: joi.string().email().required().trim(),
  password: joi.string().required().trim(),
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  console.log(password);
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
});

app.post("/singup", async (req, res) => {
  const { email, name, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);
  const validation = userSchema.validate(req.body, { abortEarly: false });
  console.log(req.body);
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
});
app.listen(5000);
