import express from 'express'
import type { Request, Response } from 'express'
import { dbClient } from "../server";
import { Comment } from "../models"


export const commentRoutes = express.Router()

commentRoutes.post("/comment", createComment)
commentRoutes.put("/comment", editComment)
commentRoutes.delete("/comment", deleteComment)
commentRoutes.get("/comment", getComment)

async function getComment(req:Request,res:Response) {
        const queryResult = await dbClient.query<Comment>("select users.name, comments.id, comments.content, comments.created_at, comments.task_id from users inner join comments on comments.user_id = users.id", )
        res.json(queryResult.rows)
}


async function createComment(req:Request,res:Response) {
    const {content,task_id} = req.body;
    await dbClient.query<Comment>("INSERT INTO comments (content, task_id, user_id, is_deleted) VALUES ($1,$2,$3,$4)",[content, task_id, req.session.user_id,false])
    res.json({message:"ok"})
}


async function editComment(req:Request,res:Response) {
    const {id,content} = req.body;
    const queryResult = await dbClient.query<Comment>("SELECT * FROM comments WHERE (id,is_deleted) = ($1,$2)",[id,false])
    const report = queryResult.rows[0]
    if(!report) {
        res.status(400).json({message:'NO THIS FUCKING comments'})
        return
    }
    if(!id || !content) {
        res.status(400).json({message:'FUCKING EMPTY'})
    }
    await dbClient.query<Comment>("UPDATE comments SET content = $2 WHERE id = $1",[id,content])
    res.json({message:"ok"})
}

async function deleteComment(req:Request, res:Response) {
    const {id} = req.body
    const queryResult = await dbClient.query<Comment>("SELECT * FROM comments WHERE (id,is_deleted) = ($1,$2)",[id,false])
    const report = queryResult.rows[0]
    if(!report) {
        res.status(400).json({message:'NO THIS FUCKING comments'})
        return
    }
    await dbClient.query<Comment>("UPDATE comments SET is_deleted = true WHERE id = $1",[id])
    res.json({message:"ok"})
}

