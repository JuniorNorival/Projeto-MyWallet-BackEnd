import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import usersrouter from "./routers/user.routers.js";
import recordsrouter from "./routers/records.routers.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(usersrouter);
app.use(recordsrouter);

app.listen(5000);
