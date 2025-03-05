import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { TeamController } from "@/controllers/teams-controller";
import { Router } from "express";


const teamRoutes = Router();
const teamController = new TeamController();

teamRoutes.post("/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  teamController.create
)

teamRoutes.put("/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  teamController.update
)

teamRoutes.get("/",
  teamController.index
)

teamRoutes.delete("/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  teamController.delete
)

export { teamRoutes }
