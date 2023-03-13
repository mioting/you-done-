import express from 'express'
import type { Request, Response } from 'express'
import { dbClient } from "../server";
import { UserProject } from "../models"

export const userProjectRoutes = express.Router()

userProjectRoutes.get("/userproject", getUserProject)
userProjectRoutes.post("/userproject", createUserProject)
userProjectRoutes.put("/userproject", editUserProject)
userProjectRoutes.delete("/userproject", deleteUserProject)

async function getUserProject(req:Request,res:Response) {
    const queryResult = await dbClient.query<UserProject>("select user_project.id as user_project_relation_id ,users.id as user_id, users.name as user_name,projects.id as project_id ,projects.name  FROM user_project INNER JOIN users ON users.id = user_project.user_id INNER JOIN projects ON user_project.project_id = projects.id")
    res.json(queryResult.rows)
}


//Section 2 Define Route Handler

async function createUserProject(req:Request,res:Response) {
    const {project_id,user_id} = req.body;

    await dbClient.query<UserProject>("INSERT INTO user_project (project_id,user_id,is_deleted) VALUES ($1,$2,$3)",[project_id,user_id,false])
    res.json({message:"ok"})
}


async function editUserProject(req:Request,res:Response) {
    const {id,project_id,user_id} = req.body;
    const queryResult = await dbClient.query<UserProject>("SELECT * FROM user_project WHERE (id,is_deleted) = ($1.$2)",[id,false])
    const userproject = queryResult.rows[0]
    if(!id) {
        res.status(400).json({message:'SELECT A PROJECT'})
        return
    }
    if(!userproject) {
        res.status(400).json({message:'NOT FOUND'})
        return
    }
    
    await dbClient.query<UserProject>("UPDATE  user_project SET (project_id,user_id) = ($2,$3) WHERE id = $1",[id,project_id,user_id])
    res.json({message:"ok"})
}

async function deleteUserProject(req:Request, res:Response) {
    const {id} = req.body
    const queryResult = await dbClient.query<UserProject>("SELECT * FROM projects WHERE (id,is_deleted) = ($1,$2)",[id,false])
    const project = queryResult.rows[0]
    if(!project) {
        res.status(400).json({message:'NOT FOUND'})
        return
    }
    await dbClient.query<UserProject>("UPDATE projects SET is_deleted = true WHERE id = $1",[id])
    res.json({message:"ok"})
}