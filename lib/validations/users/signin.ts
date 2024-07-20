import * as v from 'valibot';

export const SignInSchema = v.object({
    email: v.pipe(v.string(), v.email(),v.nonEmpty(),),
    password: v.pipe(v.string(), v.minLength(6),v.nonEmpty()),
  });