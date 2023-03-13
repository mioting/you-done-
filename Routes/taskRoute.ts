import express from 'express'
// import {isLoggedInManager} from "../middleware"
import type { Request, Response } from 'express'
import { dbClient } from "../server";
import { Task } from "../models"

export const taskRoutes = express.Router()

//Section 1 - Define endpoints (Method, Path)

taskRoutes.post("/task", createTask)
taskRoutes.put("/task", editTask)
taskRoutes.delete("/task", deleteTask)
taskRoutes.get("/task", getTask)


async function getTask(req:Request,res:Response) {
    const queryResult = await dbClient.query<Task>(/*SQL*/`
    SELECT 
        tasks.id, tasks.name, tasks.description, tasks.status, tasks.start_date, tasks.deadline, tasks.project_id,
        COALESCE(json_agg(json_build_object('id', users.id, 'name', users.name)) FILTER (WHERE users.id IS NOT NULL), '[]') AS users
    FROM tasks 
    LEFT JOIN user_task ON tasks.id = user_task.task_id
    LEFT JOIN users ON user_task.user_id = users.id
    WHERE tasks.is_deleted = false
    GROUP BY tasks.id
    ORDER BY tasks.id;
    `)
    res.json(queryResult.rows)
}

async function createTask(req:Request,res:Response) {
    const {name,description,start_date,deadline,project_id} = req.body;

    await dbClient.query<Task>("INSERT INTO tasks (name, status, description,start_date,deadline,is_deleted, project_id) VALUES ($1,$2,$3,$4,$5,$6,$7)",[name,"Not yet started",description, start_date,deadline,false,project_id])
    res.json({message:"ok"})
}


async function editTask(req:Request,res:Response) {
    const reqBody = {};
    for (const column of ['name' ,'status', 'description', 'start_date', 'deadline']) {
        if (column in req.body) {
            reqBody[column] = req.body[column];
      }
    }
  
    let sql = /*SQL*/ `UPDATE tasks SET `;
    const keys = Object.keys(reqBody);
    const params = [req.body.id]
    for (let i = 0; i < keys.length; i++) {
      const column = keys[i];
      if (i !== 0) {
        sql += ", ";
      }
      sql += `${column} = $${i + 2}`;
      params.push(reqBody[column])
    }
    sql += ` WHERE id = $1`;

    console.log(reqBody, sql, params)
    await dbClient.query<Task>(sql, params)
    // await dbClient.query<Task>("UPDATE tasks SET (name ,status, description, start_date, deadline) = ($2,$3,$4,$5,$6) WHERE id = $1",[id,name,status,description,start_date,deadline])
    res.json({message:"ok"})
}
async function deleteTask(req:Request, res:Response) {
    const {id} = req.body
    const queryResult = await dbClient.query<Task>("SELECT * FROM tasks WHERE (id,is_deleted) = ($1,$2)",[id,false])
    const task = queryResult.rows[0]
    if(!id){
        res.status(400).json({message:'SELECT A TASK'})
        return
    }
    if(!task) {
        res.status(400).json({message:'NOT FOUND'})
        return
    }
    await dbClient.query<Task>("UPDATE tasks SET is_deleted = true WHERE id = $1",[id])
    res.json({message:"ok"})
}