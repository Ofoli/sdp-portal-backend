import { model, Document, Schema } from "mongoose";
import { z } from "zod";

const userSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  color: z.string(),
  isAdmin: z.boolean().default(false),
});

const userMongooseSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, immutable: true },
    color: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

type User = z.infer<typeof userSchema>;
type UserDocument = User & Document;

export default model<UserDocument>("User", userMongooseSchema);
export { User, UserDocument, userSchema };
