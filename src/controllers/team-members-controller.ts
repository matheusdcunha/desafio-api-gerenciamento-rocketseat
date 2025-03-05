import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class TeamMembersController {
  async create(request: Request, response: Response, next: NextFunction) {

    const bodySchema = z.object({
      userId: z.number(),
      teamId: z.number()
    })

    const { userId, teamId } = bodySchema.parse(request.body)

    const teamMemberAlreadyExist = await prisma.teamMember.findFirst({ where: { userId, teamId } })

    if (teamMemberAlreadyExist) {
      throw new AppError("User and Team link already exist")
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        userId,
        teamId
      }
    })

    return response.status(201).json(teamMember)
  }

  async index(request: Request, response: Response, next: NextFunction) {
    const paramsSchema = z.object({
      teamId: z.coerce.number()
    })

    const { teamId } = paramsSchema.parse(request.params);

    const teamMembers = await prisma.teamMember.findMany({
      where: {
        teamId
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        userId: "asc"
      }
    })

    const users = teamMembers.map(member => member.user);

    return response.status(200).json(users)
  }

  async show(request: Request, response: Response, next: NextFunction) {
    const paramsSchema = z.object({
      userId: z.coerce.number()
    })

    const { userId } = paramsSchema.parse(request.params);

    const teamMembers = await prisma.teamMember.findMany({
      where: {
        userId
      },
      select: {
        team: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        teamId: "asc"
      }
    })

    const teams = teamMembers.map(team => team.team)

    return response.status(200).json(teams)
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const paramsSchema = z.object({
      id: z.coerce.number()
    })

    const bodySchema = z.object({
      teamId: z.number().optional(),
      userId: z.number().optional()
    })

    const { id } = paramsSchema.parse(request.params);
    const { teamId, userId } = bodySchema.parse(request.body)

    const teamMember = await prisma.teamMember.findFirst({ where: { id } })

    if (!teamMember) {
      throw new AppError("Team Member ID not exist");
    }

    await prisma.teamMember.update({
      where: { id },
      data: { teamId, userId }
    })

    return response.status(200).json()

  }

  async list(request: Request, response: Response, next: NextFunction) {

    const teamMembers = await prisma.teamMember.findMany({
      orderBy:
        { id: "asc" }
    })

    return response.status(200).json(teamMembers)
  }

}


export { TeamMembersController }