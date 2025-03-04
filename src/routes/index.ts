import { userRoutes } from "./users-route";
import { authRoutes } from "./aut-routes";
import { teamRoute } from "./team-routes";
import { Router } from "express";

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/auth", authRoutes)
routes.use("/teams", teamRoute)


export { routes } 
