import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class TeamController {
  async create(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      description: z.string().optional()
    })

    const { name, description } = bodySchema.parse(request.body)

    const team = await prisma.team.findFirst({ where: { name } })

    if (team) {
      throw new AppError("Team already exist")
    }

    await prisma.team.create({
      data: {
        name, description
      }
    })

    const newTeam = await prisma.team.findFirst({ where: { name } })

    return response.status(201).json(newTeam)


  }

  async index(request: Request, response: Response, next: NextFunction) {
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createAt: true,
        updatedAt: true
      },
      orderBy:{
        id: "asc"
      }
    });

    return response.status(200).json(teams)
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const paramsSchema = z.object({
      id: z.coerce.number()
    })

    const bodySchema = z.object({
      name: z.string().trim().min(2).optional(),
      description: z.string().trim().optional(),
    })

    const { id } = paramsSchema.parse(request.params);
    const { name, description } = bodySchema.parse(request.body);

    const team = await prisma.team.findFirst({ where: { id } })

    if (!team) {
      throw new AppError("Team with this ID not exist")
    }

    await prisma.team.update({
      where: { id },
      data: {
        name, description
      }
    }
    )

    return response.status(200).json()


  }

  async delete(request: Request, response: Response, next: NextFunction){
    const paramsSchema = z.object({
      id: z.coerce.number()
    })

    const { id } = paramsSchema.parse(request.params)

    const team = await prisma.team.findFirst({ where: { id } })

    if (!team) {
      throw new AppError("Team with this ID not exist")
    }

    await prisma.team.delete({ where: { id } })

    return response.status(200).json()
  }

}

export { TeamController }
