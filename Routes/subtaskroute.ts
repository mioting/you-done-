import express from 'express'
import type { Request, Response } from 'express'
import { dbClient } from "../server";
import { Subtask } from "../models"

export const subtaskRoutes = express.Router()

subtaskRoutes.post("/subtask", createSubtask)
subtaskRoutes.put("/subtask", editSubtask)
subtaskRoutes.delete("/subtask", deleteSubtask)
subtaskRoutes.get("/subtask", getSubtask)


async function getSubtask(req: Request, res: Response) {
    const queryResult = await dbClient.query<Subtask>(/*SQL*/ `
    SELECT 
    subtasks.id, subtasks.name, subtasks.description, subtasks.status, subtasks.user_id ,subtasks.task_id, users.name AS username
    FROM subtasks
    INNER JOIN users ON subtasks.user_id = users.id
    WHERE subtasks.is_deleted = FALSE
    ORDER BY subtasks.id
    `)
    res.json(queryResult.rows)
}

async function createSubtask(req: Request, res: Response) {
    const { name, description, task_id, user_id } = req.body;

    await dbClient.query<Subtask>("INSERT INTO subtasks (name, description, status, task_id,user_id,is_deleted) VALUES ($1,$2,$3,$4,$5,$6)", [name, description, "Not yet started", task_id, user_id, false])
    res.json({ message: "ok" })
}


async function editSubtask(req: Request, res: Response) {
    const reqBody = {};
    for (const column of ['name' ,'status', 'description']) {
        if (column in req.body) {
            reqBody[column] = req.body[column];
      }
    }
  
    let sql = /*SQL*/ `UPDATE subtasks SET `;
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
    await dbClient.query<Subtask>(sql, params)
    // await dbClient.query<Task>("UPDATE tasks SET (name ,status, description, start_date, deadline) = ($2,$3,$4,$5,$6) WHERE id = $1",[id,name,status,description,start_date,deadline])
    res.json({message:"ok"})
}

async function deleteSubtask(req: Request, res: Response) {
    const {id} = req.body
    const queryResult = await dbClient.query<Subtask>("SELECT * FROM subtasks WHERE (id,is_deleted) = ($1,$2)", [id, false])
    const subtask = queryResult.rows[0]
    if(!id){
        res.status(400).json({message:'SELECT A SUBTASK'})
        return
    }
    if (!subtask) {
        res.status(400).json({ message: 'NOT FOUND' })
        return
    }
    await dbClient.query<Subtask>("UPDATE subtasks SET is_deleted = true WHERE id = $1",[id])
    res.json({ message: "ok" })
}