import { Router } from "express";

import { UserController } from "@/controllers/users-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { AuthController } from "@/controllers/auth-controller";


const userRoutes = Router();
const userController = new UserController();
const authController = new AuthController();


userRoutes.post("/", userController.create)

userRoutes.get("/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]), 
  userController.index)

userRoutes.put("/:id", 
  ensureAuthenticated, 
  verifyUserAuthorization(["admin"]), 
  userController.update)

userRoutes.delete("/:id", 
  ensureAuthenticated, 
  verifyUserAuthorization(["admin"]), 
  userController.delete
)

userRoutes.patch("/:id",
  ensureAuthenticated, 
  verifyUserAuthorization(["admin"]), 
  authController.update
)



export { userRoutes }