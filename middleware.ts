import type { Request, Response, NextFunction} from "express"

declare module "express-session" {
    interface SessionData {
      user_id : number,
      manager : boolean;
      admin : boolean
    }
  }

  // export const isLoggedInStatic = (req:Request, res:Response, next:NextFunction) => {
  //   if (!req.session.user_id) {
  //       res.redirect("/")
  //       return
  //   } else {
  //       next()
  //   }
  // }

  export const isLoggedInManager = (req:Request, res:Response, next:NextFunction) => {
    if (!req.session.user_id || req.session.manager == false) {
        res.status(401).json({message:"FUCK OFF"})
        return
    } else if (req.session.user_id && req.session.manager == true){ 
        next()
    }
  }

  export const isLoggedInTeam = (req:Request, res:Response, next:NextFunction) => {
    if (!req.session.user_id || req.session.manager == true) {
        res.status(401).json({message:"FUCK OFF"})
        return
    } else { 
        next()
    }
  }

  export const isLoggedInAdmin = (req:Request, res:Response, next:NextFunction) => {
    if (req.session.admin == false) {
        res.status(401).json({message:"FUCK OFF"})
        return
    } else { 
        next()
    }
  }