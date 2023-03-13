import express from 'express'
import type { Request, Response } from 'express'
import {dbClient} from "../server"
import { User } from '../models'
import { checkPassword } from '../hash'
export const userRoutes = express.Router()

 
//Section 1 - Define endpoints (Method, Path)
userRoutes.post("/login", login) //funtion name//)
userRoutes.get("/logout", logout);
userRoutes.get("/user", getUser)
userRoutes.get("/userName", getUserName)

async function logout(req: express.Request, res: express.Response) {
    delete req.session.user_id
    req.session.manager=false
    req.session.admin=false
    res.redirect("/");
  }

//Section 2 Define Route Handler

async function getUser(req:Request,res:Response) {
    const queryResult = await dbClient.query<User>("SELECT id,name,username,password,title,is_manager,is_deleted FROM users WHERE is_deleted = false AND is_manager = false ORDER BY id ASC")
    res.json(queryResult.rows)
}
async function getUserName(req:Request,res:Response) {
    const queryResult = await dbClient.query<User>("SELECT name FROM users WHERE is_deleted = false AND id = $1 ORDER BY id ASC", [req.session.user_id])
    res.json(queryResult.rows)
}

async function login(req:Request, res:Response) {
    const {username, password} = req.body;
    if(!username || !password) {
        res.status(400).json({message:'missing username/password'})
        return
    }

    const queryResult = await dbClient.query<User>("SELECT * FROM users WHERE username = $1",[username])

        const user = queryResult.rows[0]

    if (!user || !(await checkPassword(password, user.password))) {
        res.status(401).json({message: "invalid username/password"})
        return
    }
    if (user.is_manager == true) {
        req.session.user_id = user.id
        req.session.manager  = true
        req.session.admin = false
        res.json({message: "ok", role:"manager"})
        
    } else {
        req.session.user_id = user.id
        req.session.manager = false
        req.session.admin = false
        res.json({message: "ok", role:"worker"})
    }
    }
