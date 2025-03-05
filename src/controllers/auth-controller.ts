import { Request, Response, NextFunction } from "express";
import { sign, type SignOptions } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";
import { prisma } from "@/database/prisma";
import { z } from "zod"

class AuthController {
  async create(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6).trim()
    })

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({ where: { email } })

    if (!user) {
      throw new AppError("Invalid email or password", 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError("Invalid email or password", 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const options: SignOptions = {
      expiresIn,
      subject: String(user.id)
    }

    const token = sign({ role: user.role ?? "member" },
      secret, options
    )


    const { password: _, ...userWhitouPassword } = user;

    return response.json({ ...userWhitouPassword, token })

  }

  async update(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      role: z.enum(["admin", "member"])
    })

    const paramsSchema = z.object({
      id: z.coerce.number()
    })

    const { role } = bodySchema.parse(request.body);
    const { id } = paramsSchema.parse(request.params);

    await prisma.user.update({
      where:{
        id
      },
      data:{
        role
      }
    })

    return response.status(200).json()

  }

}

export { AuthController }