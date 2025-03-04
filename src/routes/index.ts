import { Router } from "express";
import { userRoutes } from "./users-route";

const routes = Router()

routes.use("/users", userRoutes)


export { routes } 
