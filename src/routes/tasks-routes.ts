import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { TaskController } from "@/controllers/task-controller";
import { Router } from "express";

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.post("/:adminId",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  taskController.create
)

taskRoutes.put("/:taskId",
  ensureAuthenticated,
  verifyUserAuthorization(["admin", "member"]),
  taskController.update
)

taskRoutes.get("/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin", "member"]),
  taskController.show
)

taskRoutes.get("/admin",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  taskController.index
)

export { taskRoutes };
