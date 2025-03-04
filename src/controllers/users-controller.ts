import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

class UserController {
  async create(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      name: z.string().trim().min(3),
      email: z.string().email(),
      password: z.string().min(6).trim()
    }
    )

    const { name, email, password } = bodySchema.parse(request.body)

    const userWithSameEmail = await prisma.user.findFirst({ where: { email } })
    const encryptPass = await hash(password, 8)

    if (userWithSameEmail) {
      throw new AppError("User with same email already exists")
    }

    const user = await prisma.user.create({
      data: {
        name, email, password: encryptPass
      }
    })

    const { password: _, ...userWithoutPassword } = user

    return response.status(201).json(userWithoutPassword)

  }

  async index(request: Request, response: Response, next: NextFunction) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createAt: true,
        updatedAt: true
      }
    });

    return response.status(200).json(users)
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      name: z.string().trim().min(3).optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).trim().optional()
    })

    const paramsSchema = z.object({
      id: z.coerce.number()
    })

    const { name, email, password } = bodySchema.parse(request.body);
    const { id } = paramsSchema.parse(request.params);

    let encryptPass

    if (password) {
      encryptPass = await hash(password, 8)
    }


    const userExist = await prisma.user.findFirst({ where: { id } })

    if (!userExist) {
      throw new AppError("User not exist")
    }


    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: encryptPass
      }
    })

    return response.status(200).json()

  }

  async delete(request: Request, response: Response, next: NextFunction) {
    const paramsSchema = z.object({
      id: z.coerce.number()
    })

    const { id } = paramsSchema.parse(request.params)

    const user = await prisma.user.findFirst({ where: { id } })

    if(!user){
      throw new AppError("User not exist")
    }

    

  }

}

export { UserController }