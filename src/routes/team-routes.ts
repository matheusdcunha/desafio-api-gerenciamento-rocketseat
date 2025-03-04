import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { TeamController } from "@/controllers/team-controller";
import { Router } from "express";


const teamRoute = Router();
const teamController = new TeamController();

teamRoute.post("/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  teamController.create
)

teamRoute.put("/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  teamController.update
)

teamRoute.get("/",
  teamController.index
)

teamRoute.delete("/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  teamController.delete
)

export { teamRoute }
