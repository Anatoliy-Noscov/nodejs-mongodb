import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    console.log('Validating body:', req.body);
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    console.log('Validation error:', err.details);
    const error = createHttpError(400, 'Bad Request', {
      errors: err.details,
    });
    next(error);
  }
};