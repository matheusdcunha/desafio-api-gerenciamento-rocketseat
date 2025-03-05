import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { z } from "zod";


class TaskHistoryController {
  async index(request: Request, response: Response, next: NextFunction) {

    const taskHistories = await prisma.taskHistory.findMany()

    return response.json(taskHistories)
  }
}

export { TaskHistoryController }