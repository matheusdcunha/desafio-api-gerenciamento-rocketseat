import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { TaskHistoryController } from "@/controllers/task-history-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { Router } from "express";

const taskHistoriesRoutes = Router();
const taskHistoryController = new TaskHistoryController();

taskHistoriesRoutes.get("/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  taskHistoryController.index
)

export { taskHistoriesRoutes }