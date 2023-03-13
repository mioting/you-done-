export interface User {
    id: number,
    username:string,
    password:string,
    title:string,
    is_manager: boolean,
    user_id : number
}

export interface Project {
    id:number,
    name?:string,
    start_date?:Date,
    deadline?:Date,
    user_id:number,
    is_deleted:boolean
}
export interface Task {
    id:number,
    name:string,
    description:string,
    status: string,
    start_date:Date,
    deadline:Date,
    project_id:number,
    is_deleted:boolean
}

export interface Admin {
    username:string,
    password:string,

}

export interface Subtask {
    id:number,
    name:string,
    description:string,
    status: string,
    is_deleted:boolean,
    user_id:number,
    task_id:number
}

export interface Comment {
    id:number,
    content: string,
    is_deleted:boolean,
    user_id:number,
    task_id:number
}

export interface File {
    id:number,
    content: string,
    is_deleted:boolean,
    user_id:number,
    task_id:number
}

export interface UserProject {
    id: number,
    project_id: number,
    user_id:number
}
export interface UserTask {
    id: number,
    task_id: number,
    user_id:number
}