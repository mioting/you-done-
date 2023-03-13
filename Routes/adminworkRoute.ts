import express from 'express'
import type { Request, Response } from 'express'
import {dbClient} from "../server"
import { User } from '../models'

import { hashPassword } from '../hash';
import { isLoggedInAdmin } from '../middleware'

export const adminworkRoutes = express.Router()
adminworkRoutes.post("/adminwork",  isLoggedInAdmin ,createUser)
adminworkRoutes.put("/adminwork", isLoggedInAdmin ,editUser)
adminworkRoutes.delete("/adminwork", isLoggedInAdmin ,deleteUser)


async function createUser(req:Request,res:Response) {
    const {name, username,password,title,is_manager} = req.body;
    const hashedUserPassword = (await hashPassword(password)).toString()
    await dbClient.query<User>("INSERT INTO users (name, username,password,title,is_manager,is_deleted) VALUES ($1,$2,$3,$4,$5,$6)",[name, username,hashedUserPassword,title,is_manager,false])
    res.json({message:"ok"})
}


async function editUser(req:Request,res:Response) {
    const {name, username,password,title,is_manager} = req.body;
    const hashedUserPassword = (await hashPassword(password)).toString()
    const queryResult = await dbClient.query<User>("SELECT * FROM users WHERE (username,is_deleted) = ($1,$2)",[username,false])
    const usernameCheck = queryResult.rows[0]
    if(!usernameCheck) {
        res.status(400).json({message:'NO THIS FUCKING user'})
        return
    }
    if(!name || !username || !password || !title || ! is_manager) {
        res.status(400).json({message:'FUCKING EMPTY'})
    }
    await dbClient.query<User>("UPDATE users SET (name, password, title, is_manager) = ($2,$3,$4,$5) WHERE name = $1",[username,name, hashedUserPassword, title, is_manager])
    res.json({message:"ok"})
}

async function deleteUser(req:Request, res:Response) {
    const {username} = req.body
    const queryResult = await dbClient.query<User>("SELECT * FROM users WHERE (username,is_deleted) = ($1,$2)",[username,false])
    const usernameCheck = queryResult.rows[0]
    if(!usernameCheck) {
        res.status(400).json({message:'NO THIS FUCKING user'})
        return
    }
    await dbClient.query<User>("UPDATE users SET is_deleted = true WHERE username = $1",[username])
    res.json({message:"ok"})
}