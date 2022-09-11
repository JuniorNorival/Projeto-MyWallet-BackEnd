import joi from "joi";

const recordSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required().trim(),
});
async function recordValidation(req, res, next) {
  const validation = recordSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const error = validation.error.details.map((erro) => erro.message);
    res.status(422).send(error);
    return;
  }
  next();
}
export { recordValidation };
