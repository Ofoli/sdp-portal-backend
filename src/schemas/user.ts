import { z } from "zod";

const userSchema = z.object({
  firstname: z.string().min(3),
  lastname: z.string().min(3),
  email: z
    .string()
    .email()
    .refine((value) => value.endsWith("@nalosolutions.com"), {
      message: "Must be a NALO email",
    }),
  password: z.string().min(12),
  color: z.string(),
  isAdmin: z.boolean().default(false),
});

const loginSchema = z.object({
  email: z
    .string()
    .email()
    .refine((value) => value.endsWith("@nalosolutions.com"), {
      message: "Must be a NALO email",
    }),
  password: z.string().min(12),
});

export { userSchema, loginSchema };
