import dotenv from "dotenv"
dotenv.config();
import express from "express";
// import { Request, Response } from 'express'
import path from 'path'
import expressSession from 'express-session'
// import http from 'http';
// import {Server as SocketIO} from 'socket.io';
import pg from "pg";
import { logger } from "./logger";
import { userRoutes} from "./Routes/userRoute";
import { projectRoutes} from "./Routes/projectRoute";
// import { isLoggedInManager } from "./middleware";
import { isLoggedInAdmin, isLoggedInManager, isLoggedInTeam} from "./middleware";
import { taskRoutes } from "./Routes/taskRoute";
import {adminRoutes} from "./Routes/adminRoute";
import {adminworkRoutes} from "./Routes/adminworkRoute"
import {subtaskRoutes} from "./Routes/subtaskroute"
import {commentRoutes} from "./Routes/commentRoute"
import {fileRoutes} from "./Routes/fileRoute"
import { userProjectRoutes } from "./Routes/userProjectRoute";
import { userTaskRoutes } from "./Routes/userTaskRoute";
import {dashboardRoute} from "./Routes/dashboardRoute"
import { workerRoutes } from "./Routes/workerRoute";

export const dbClient = new pg.Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });
  dbClient.connect();

  declare module "express-session" {
    interface SessionData {
      user_id : number,
      manager: boolean,
      admin:boolean
  }
}

const app = express()
// const server = new http.Server(app);
// const io = new SocketIO(server);
// Section 1 (Middleware for all Routes)
app.use(expressSession({
    secret: Math.random().toString(32).slice(2),
    resave: true,
    saveUninitialized: true,
  }));

  app.use(express.json());

  
// Section 2 (Routers)

app.use(userRoutes)
app.use(projectRoutes)
app.use(taskRoutes)
app.use(subtaskRoutes)
app.use(adminRoutes)
app.use(adminworkRoutes)
app.use(commentRoutes)
app.use(fileRoutes)
app.use(userProjectRoutes)
app.use(userTaskRoutes)
app.use(commentRoutes)
app.use(dashboardRoute)
app.use(workerRoutes)




//Section 3 (Serve Files))

app.use(express.static(path.join(__dirname, "public")))

// app.use(isLoggedInManager, express.static(path.join(__dirname, "manager")))
app.use('/worker',isLoggedInTeam,express.static(path.join(__dirname, 'worker')))

app.use('/manager',isLoggedInManager, express.static(path.join(__dirname, "manager")))

app.use('/uploads', express.static(path.join(__dirname, "uploads")));

app.use(isLoggedInAdmin, express.static(path.join(__dirname, "admin")))








app.use((req, res) => {
    res.sendFile(path.resolve('./public/404.html'))
  })

const PORT = 8080

app.listen(PORT, () => {
    logger.info(`Listening at http://localhost:${PORT}/`)
  })