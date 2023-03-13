import express from 'express'
import type { Request, Response } from 'express'
import { dbClient } from "../server";
import { Project } from "../models"

export const projectRoutes = express.Router()

//Section 1 - Define endpoints (Method, Path)

projectRoutes.post("/project", createProject)
projectRoutes.put("/project", editProject)
projectRoutes.delete("/project", deleteProject)
projectRoutes.get("/project", getProject)




async function getProject(req:Request,res:Response) {
    const queryResult = await dbClient.query<Project>("SELECT id,name,start_date,deadline,user_id FROM projects WHERE (is_deleted,user_id) = ($1,$2) ORDER BY id ASC",[false, req.session.user_id])
    res.json(queryResult.rows)
}



//Section 2 Define Route Handler

async function createProject(req:Request,res:Response) {
    const {name,start_date,deadline} = req.body;
    await dbClient.query<Project>("INSERT INTO projects (name,start_date,deadline,is_deleted,is_completed,user_id) VALUES ($1,$2,$3,$4,$5,$6)",[name,start_date,deadline,false,false, req.session.user_id])
    res.json({message:"ok"})
}


async function editProject(req:Request,res:Response) {
    const reqBody = {};
    for (const column of ['name' , 'start_date', 'deadline']) {
        if (column in req.body) {
            reqBody[column] = req.body[column];
      }
    }
  
    let sql = /*SQL*/ `UPDATE projects SET `;
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
    await dbClient.query<Project>(sql, params)
    // await dbClient.query<Task>("UPDATE tasks SET (name ,status, description, start_date, deadline) = ($2,$3,$4,$5,$6) WHERE id = $1",[id,name,status,description,start_date,deadline])
    res.json({message:"ok"})
}

async function deleteProject(req:Request, res:Response) {

    const {id,is_completed} = req.body
    const queryResult = await dbClient.query<Project>("SELECT * FROM projects WHERE (id,is_deleted) = ($1,$2)",[id,false])
    const project = queryResult.rows[0]
    if(!id){
        res.status(400).json({message:'SELECT A PROJECT'})
        return
    }
    if(!project) {
        res.status(400).json({message:'NOT FOUND'})
        return
    }
    await dbClient.query<Project>("UPDATE projects SET (is_deleted,is_completed) = (true,$2) WHERE id = $1",[id,is_completed])
    res.json({message:"ok"})
}