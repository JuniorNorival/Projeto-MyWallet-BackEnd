import joi from "joi";

const userSchema = joi.object({
  name: joi.string().required().trim(),
  email: joi.string().email().required().trim(),
  password: joi.string().required().trim(),
});
async function userValidate(req, res, next) {
  const validation = userSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const error = validation.error.details.map((erro) => erro.message);
    res.status(422).send(error);
    return;
  }

  next();
}

export { userValidate };
