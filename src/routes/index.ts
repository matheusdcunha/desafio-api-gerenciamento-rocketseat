import { teamMemberRoutes } from "./team-member-routes";
import { userRoutes } from "./users-route";
import { authRoutes } from "./aut-routes";
import { teamRoutes } from "./team-routes";
import { taskRoutes } from "./tasks-routes";
import { Router } from "express";

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/auth", authRoutes)
routes.use("/teams", teamRoutes)
routes.use("/teams_members", teamMemberRoutes)
routes.use("/tasks", taskRoutes)


export { routes } 
