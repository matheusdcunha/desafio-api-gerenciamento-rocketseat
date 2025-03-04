import { authRoutes } from "./aut-routes";
import { userRoutes } from "./users-route";
import { Router } from "express";

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/auth", authRoutes)


export { routes } 
