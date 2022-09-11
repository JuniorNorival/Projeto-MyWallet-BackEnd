import db from "../database/db.js";
import dayjs from "dayjs";

async function get(req, res) {
  const { user } = res.locals;
  console.log(user);
  const record = await db
    .collection("records")
    .find({ userId: user._id })
    .toArray();
  const records = { name: user.name, records: record };
  res.send(records).status(200);
}

async function create(req, res) {
  const { value, description } = req.body;
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
