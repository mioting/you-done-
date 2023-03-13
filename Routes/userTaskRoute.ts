import express from 'express'
import type { Request, Response } from 'express'
import { dbClient } from "../server";
import { UserTask } from "../models"

export const userTaskRoutes = express.Router()

userTaskRoutes.get("/usertask", getUserTask)
userTaskRoutes.post("/usertask", createUserTask)
userTaskRoutes.put("/usertask", editUserTask)
userTaskRoutes.delete("/usertask", deleteUserTask)

async function getUserTask(req:Request,res:Response) {
    const queryResult = await dbClient.query<UserTask>("select user_task.id as user_task_relation_id ,users.id as user_id, users.name as user_name,tasks.id as task_id ,tasks.name  FROM user_task INNER JOIN users ON users.id = user_task.user_id INNER JOIN tasks ON user_task.task_id = tasks.id")
    res.json(queryResult.rows)
}


//Section 2 Define Route Handler

async function createUserTask(req:Request,res:Response) {
    const {task_id,user_id} = req.body;

    await dbClient.query<UserTask>("INSERT INTO user_task (task_id,user_id,is_deleted) VALUES ($1,$2,$3)",[task_id,user_id,false])
    res.json({message:"ok"})
}


async function editUserTask(req:Request,res:Response) {
    const {id,task_id,user_id} = req.body;
    const queryResult = await dbClient.query<UserTask>("SELECT * FROM user_task WHERE (id,is_deleted) = ($1.$2)",[id,false])
    const UserTask = queryResult.rows[0]
     if(!id) {
        res.status(400).json({message:'SELECT A TASK'})
        return
    }
    if(!UserTask) {
        res.status(400).json({message:'NOT FOUND'})
        return
    }
   
    await dbClient.query<UserTask>("UPDATE  user_task SET (task_id,user_id) = ($2,$3) WHERE id = $1",[id,task_id,user_id])
    res.json({message:"ok"})
}

async function deleteUserTask(req:Request, res:Response) {
    const {id} = req.body
    const queryResult = await dbClient.query<UserTask>("SELECT * FROM projects WHERE (id,is_deleted) = ($1,$2)",[id,false])
    const project = queryResult.rows[0]
    if(!project) {
        res.status(400).json({message:'NOT FOUND'})
        return
    }
    await dbClient.query<UserTask>("UPDATE projects SET is_deleted = true WHERE id = $1",[id])
    res.json({message:"ok"})
}