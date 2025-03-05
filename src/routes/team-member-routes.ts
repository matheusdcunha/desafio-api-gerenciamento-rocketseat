import { Router } from "express";
import { TeamMembersController } from "@/controllers/team-members-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const teamMemberRoutes = Router();
const teamMemberController = new TeamMembersController();


teamMemberRoutes.post("/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),  
  teamMemberController.create
)

teamMemberRoutes.get("/", 
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]), 
  teamMemberController.list
)

teamMemberRoutes.put("/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),  
  teamMemberController.update
)

teamMemberRoutes.get("/team/:teamId",
  ensureAuthenticated,
  verifyUserAuthorization(["admin", "member"]), 
  teamMemberController.index
)

teamMemberRoutes.get("/user/:userId",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]), 
  teamMemberController.show
)




export { teamMemberRoutes}