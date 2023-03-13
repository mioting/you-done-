import express from 'express'
import type { Request, Response } from 'express'
import {dbClient} from "../server"
import { Admin } from '../models'
export const adminRoutes = express.Router()

 
//Section 1 - Define endpoints (Method, Path)
adminRoutes.post("/admin", login) //funtion name//)
adminRoutes.get("/logout", logout);

async function logout(req: express.Request, res: express.Response) {
    req.session.admin=false
    res.redirect("/");
  }

//Section 2 Define Route Handler
async function login(req:Request, res:Response) {
    const {username, password} = req.body;
    if(!username || !password) {
        res.status(400).json({message:'missing username/password'})
        return
    }

    const queryResult = await dbClient.query<Admin>("SELECT * FROM admin WHERE username = $1",[username])

        const user = queryResult.rows[0]

    if (!user) {
        res.status(401).json({message: "invalid username/password"})
        return
    }
    
    req.session.admin=true
    res.json({message: "success"})}


