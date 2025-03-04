import { env } from "@/env"
import type { StringValue } from "ms"


export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: "1d" as unknown as StringValue
  }
}