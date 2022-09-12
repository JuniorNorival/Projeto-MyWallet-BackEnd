import joi from "joi";

const newUserSchema = joi.object({
  name: joi.string().required().trim(),
  email: joi.string().email().required().trim(),
  password: joi.string().required().trim(),
  confirmPassword: joi.string().required().valid(joi.ref("password")),
});
const userSchema = joi.object({
  email: joi.string().email().required().trim(),
  password: joi.string().required().trim(),
});
async function newUserValidate(req, res, next) {
  console.log(req.body);
  const validation = newUserSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const error = validation.error.details.map((erro) => erro.message);
    res.status(422).send(error);
    return;
  }

  next();
}

async function userValidate(req, res, next) {
  const validation = userSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const error = validation.error.details.map((erro) => erro.message);
    res.status(422).send(error);
    return;
  }

  next();
}

export { userValidate, newUserValidate };
