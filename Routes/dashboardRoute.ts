import express from 'express'
// import {isLoggedInManager} from "../middleware"
import type { Request, Response } from 'express'
import { dbClient } from "../server";
import { Task, Project , Subtask} from "../models"

export const dashboardRoute = express.Router()

dashboardRoute.get('/dashboardProject', getProject)
dashboardRoute.get('/workerDashboardProject', getWorkerProject)
dashboardRoute.get('/dashboardTask', getTask)
dashboardRoute.get('/dashboardManagerTask', getManagerTask)
dashboardRoute.get('/dashboardSubtask', getSubtask)
dashboardRoute.get('/dashboardManagerSubtask', getManagerSubtask)


async function getProject(req:Request,res:Response) {
    const queryResult = await dbClient.query<Project>(/*SQL*/ `SELECT projects.id,projects.name,projects.start_date,projects.deadline,projects.user_id,projects.is_completed,
    COALESCE(json_agg(json_build_object('id', tasks.id, 'name', tasks.name, 'taskStatus', tasks.status)) FILTER (WHERE tasks.id IS NOT NULL), '[]') AS tasks
    FROM projects 
    LEFT JOIN tasks ON projects.id = tasks.project_id
    WHERE (projects.is_deleted,projects.user_id) = ($1,$2) 
    GROUP BY projects.id
    ORDER BY deadline DESC;`, [false, req.session.user_id])
    res.json(queryResult.rows)
}

async function getWorkerProject(req:Request,res:Response) {
    const queryResult = await dbClient.query<Project>(/*SQL*/ `SELECT projects.id,projects.name,projects.start_date,projects.deadline,projects.user_id,projects.is_completed

    FROM projects 

    INNER JOIN user_project ON user_project.project_id = projects.id
    INNER JOIN users ON user_project.user_id = users.id
    WHERE (projects.is_deleted,users.id) = ($1,$2) 
    GROUP BY projects.id
    ORDER BY deadline DESC;`, [false, req.session.user_id])
    res.json(queryResult.rows)
}
async function getManagerTask(req:Request,res:Response) {
    const queryResult = await dbClient.query<Task>(/*SQL*/`
    SELECT 
        tasks.id, tasks.name, tasks.description, tasks.status, tasks.start_date, tasks.deadline, tasks.project_id
    FROM tasks 
    LEFT JOIN projects ON tasks.project_id = projects.id
    WHERE tasks.is_deleted = false and projects.user_id = $1
    GROUP BY tasks.id
    ORDER BY deadline DESC;
    `,[req.session.user_id])
    res.json(queryResult.rows)
}
async function getTask(req:Request,res:Response) {
    const queryResult = await dbClient.query<Task>(/*SQL*/`
    SELECT 
        tasks.id, tasks.name, tasks.description, tasks.status, tasks.start_date, tasks.deadline, tasks.project_id, 
        COALESCE(json_agg(json_build_object('id', users.id, 'name', users.name)) FILTER (WHERE users.id IS NOT NULL), '[]') AS users
    FROM tasks 
    LEFT JOIN user_task ON tasks.id = user_task.task_id
    LEFT JOIN users ON user_task.user_id = users.id
    WHERE tasks.is_deleted = false  AND users.id = $1
    GROUP BY tasks.id
    ORDER BY tasks.id;
    `,[req.session.user_id])
    res.json(queryResult.rows)
}

async function getSubtask(req: Request, res: Response) {
    const queryResult = await dbClient.query<Subtask>(/*SQL*/ `
    SELECT 
    subtasks.id, subtasks.name, subtasks.description, subtasks.status, subtasks.user_id ,subtasks.task_id, users.name AS username
    FROM subtasks
    INNER JOIN users ON subtasks.user_id = users.id
    WHERE subtasks.is_deleted = FALSE and subtasks.user_id = $1
    ORDER BY subtasks.id
    `,[req.session.user_id])
    res.json(queryResult.rows)
}


async function getManagerSubtask(req: Request, res: Response) {
    const queryResult = await dbClient.query<Subtask>(/*SQL*/ `
    SELECT 
    subtasks.id, subtasks.name, subtasks.description, subtasks.status, subtasks.user_id ,subtasks.task_id,users.name AS username, projects.user_id AS managerCheck
    FROM subtasks
    INNER JOIN users ON subtasks.user_id = users.id
    INNER JOIN tasks ON subtasks.task_id = tasks.id
    INNER JOIN projects ON tasks.project_id = projects.id
    WHERE subtasks.is_deleted = FALSE and projects.user_id = $1
    ORDER BY subtasks.id
    `, [req.session.user_id])
    res.json(queryResult.rows)
}