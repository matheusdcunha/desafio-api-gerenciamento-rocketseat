import { Router } from "express";

import { UserController } from "@/controllers/users-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";


const userRoutes = Router();
const userController = new UserController();


userRoutes.post("/", userController.create)
userRoutes.get("/", userController.index)
userRoutes.put("/:id", userController.update)
userRoutes.delete("/:id", ensureAuthenticated, verifyUserAuthorization(["admin"]), userController.delete)


export { userRoutes }