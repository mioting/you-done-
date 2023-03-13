import express from 'express'
import type { Request, Response } from 'express'
import { dbClient } from "../server";
import { Project , Task } from "../models"

export const workerRoutes = express.Router()

workerRoutes.get("/workerProject", getProject)
workerRoutes.get("/workerTask", getTask)
workerRoutes.get("/workerSubtask", getSubtask)


async function getProject(req:Request,res:Response) {
    const queryResult = await dbClient.query<Project>(/*SQL*/`
    SELECT 
       projects.id, projects.name, projects.start_date, projects.deadline
    FROM projects
    INNER JOIN user_project ON projects.id = user_project.project_id
    INNER JOIN users ON user_project.user_id = users.id
    WHERE projects.is_deleted = false and users.id = $1
    GROUP BY projects.id
    ORDER BY projects.id;`
    ,[req.session.user_id])
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
    WHERE tasks.is_deleted = false and users.id = $1
    GROUP BY tasks.id
    ORDER BY tasks.id;
    `, [req.session.user_id])
    res.json(queryResult.rows)
}

async function getSubtask(req:Request,res:Response) {
    const queryResult = await dbClient.query<Task>(/*SQL*/`
    SELECT 
    subtasks.id, subtasks.name, subtasks.description, subtasks.status, subtasks.user_id ,subtasks.task_id, users.name AS username
    FROM subtasks
    INNER JOIN users ON subtasks.user_id = users.id
    WHERE subtasks.is_deleted = FALSE and users.id = $1
    ORDER BY subtasks.id
    
    `, [req.session.user_id])
    res.json(queryResult.rows)
}

