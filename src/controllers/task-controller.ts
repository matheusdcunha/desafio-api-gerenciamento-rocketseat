import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class TaskController {
  async create(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      title: z.string().trim().min(2),
      description: z.string().trim().optional(),
      priority: z.enum(["high", "medium", "low"]),
      assignedTo: z.number(),
      teamId: z.number()
    })

    const paramsSchema = z.object({
      adminId: z.coerce.number()
    })

    const { title, description, priority, assignedTo, teamId } = bodySchema.parse(request.body)
    const { adminId } = paramsSchema.parse(request.params)

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        assignedTo,
        teamId
      }
    })

    await prisma.taskHistory.create({
      data: {
        taskId: task.id,
        changedBy: adminId,
        oldStatus: task.status,
        newStatus: task.status
      }
    })

    return response.status(201).json(task)
  }

  async update(request: Request, response: Response, next: NextFunction) {

    const userIdSchema = z.object({
      id: z.coerce.number(),
      role: z.enum(["admin", "member"])
    })

    const paramsSchema = z.object({
      taskId: z.coerce.number()
    })

    const bodySchema = z.object({
      title: z.string().trim().min(2).optional(),
      description: z.string().trim().optional(),
      status: z.enum(["in_progress", "completed"]).optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
      assignedTo: z.number().optional(),
      teamId: z.number().optional()
    })

    const { taskId } = paramsSchema.parse(request.params)
    const { title, description, status, priority, assignedTo, teamId } = bodySchema.parse(request.body)
    const { id, role } = userIdSchema.parse(request.user)

    const task = await prisma.task.findFirst({
      where: { id: taskId }
    })

    if (!task) {
      throw new AppError("Task not exist")
    }

    if (role === "member" && task.assignedTo !== id) {
      throw new AppError("Task not assigned to this user")
    }

    const taskUpdated = await prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        title,
        description,
        status,
        priority,
        assignedTo,
        teamId
      }
    })

    await prisma.taskHistory.create({
      data: {
        taskId,
        changedBy: id,
        oldStatus: task.status,
        newStatus: taskUpdated.status,
      }
    })

    return response.status(200).json(taskUpdated)

  }

  async show(request: Request, response: Response, next: NextFunction) {
    const userIdSchema = z.object({
      id: z.coerce.number(),
      role: z.enum(["admin", "member"])
    })

    const { id } = userIdSchema.parse(request.user)

    const tasks= await prisma.task.findMany({ 
      where: {assignedTo: id},
      select:{
        id:true,
        title:true,
        description:true,
        status: true,
        priority: true,
        team:{
          select:{
            id:true,
            name:true
          }
        }
      },
      orderBy:{
        id:"asc"
      }
     })

     return response.status(200).json(tasks)

  }

  async index(request: Request, response: Response, next: NextFunction) {

    const tasks = await prisma.task.findMany()

    return response.status(200).json(tasks)

  }

  

}

export { TaskController }