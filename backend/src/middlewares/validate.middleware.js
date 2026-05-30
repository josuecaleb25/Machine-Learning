import { ZodError } from 'zod';
import { error } from '../utils/apiResponse.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const data = source === 'query' ? req.query : source === 'params' ? req.params : req.body;
      const parsed = schema.parse(data);
      if (source === 'query') req.query = parsed;
      else if (source === 'params') req.params = parsed;
      else req.body = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        return error(res, { message, statusCode: 400 });
      }
      next(err);
    }
  };
}
