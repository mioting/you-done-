import dotenv from 'dotenv'
import pg from "pg";
import { hashPassword } from './hash';
import XLSX from 'xlsx'
import moment from "moment-timezone"

dotenv.config()

interface UserData {
    name: string, username: string, password: string, title: string, is_manager: boolean
}
interface ProjectData {
    name: string, start_date: Date, deadline: Date, user: string , is_completed :boolean
}
interface TaskData {
    name: string, description: string, status: string, start_date: Date, deadline: Date, project: string
}
interface SubtaskData {
    name: string, description: string, status: string, task: string, user: string 
}
interface CommentData {
    content: string, user: string, task: string
}
interface UserProjectData {
    user: string, project: string
}
interface UserTaskData {
    user: string, task: string
}
interface FileData {
    name: string, comment: string, 
}
interface AdminData {
    username: string, password: string
}
async function importData() {
    const client = new pg.Client({
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    });

    await client.connect();


    // DELETE FROM ALL TABLES
    for (const table of ["admin", "files", "user_project", "user_task", "comments", "subtasks", "tasks", "projects", "users"]) {
        await client.query(`DELETE FROM ${table}`);
    }

    // INSERT DUMMY DATA
    const workbook = XLSX.readFile('dummy.xlsx', { cellDates: true })
    const userData = XLSX.utils.sheet_to_json<UserData>(workbook.Sheets['users'])
    const projectData = XLSX.utils.sheet_to_json<ProjectData>(workbook.Sheets['projects'])
    const taskData = XLSX.utils.sheet_to_json<TaskData>(workbook.Sheets['tasks'])
    const subtaskData = XLSX.utils.sheet_to_json<SubtaskData>(workbook.Sheets['subtasks'])
    const commentData = XLSX.utils.sheet_to_json<CommentData>(workbook.Sheets['comments'])
    const userTaskData = XLSX.utils.sheet_to_json<UserTaskData>(workbook.Sheets['user_task'])
    const userProjectData = XLSX.utils.sheet_to_json<UserProjectData>(workbook.Sheets['user_project'])
    const fileData = XLSX.utils.sheet_to_json<FileData>(workbook.Sheets['files'])
    const adminData = XLSX.utils.sheet_to_json<AdminData>(workbook.Sheets['admin'])

    //INSERTING
    for (const user of userData) {
        const hashedUserPassword = await hashPassword(user.password.toString())
        user.name
        user.username
        user.title
        user.is_manager
        await client.query(
            'INSERT INTO users (name, username, password, title, is_manager,is_deleted) values ($1,$2,$3,$4,$5,$6)',
            [user.name, user.username, hashedUserPassword, user.title, user.is_manager, false]
        )
    }

    const userQueryResult = await client.query<{ id: number; username: string }>(
        "SELECT id, username FROM users"
    )
    const users = userQueryResult.rows;
    const userMap = users.reduce(
        (prev, cur) => prev.set(cur.username, cur.id),
        new Map<string, number>()
    )
    for (const project of projectData) {
        project.name
        moment(project.start_date.setHours(32, 1)).toDate()
        moment(project.deadline.setHours(32, 1)).toDate()
        await client.query(
            'INSERT INTO projects (name,  start_date, deadline, user_id, is_deleted, is_completed) values ($1,$2,$3,$4,$5,$6)',
            [project.name, project.start_date, project.deadline, userMap.get(project.user), false, false]
        )

    }
    const projectQueryResult = await client.query<{ id: number; name: string }>
        ("SELECT id, name FROM projects")
    const projects = projectQueryResult.rows;
    const projectMap = projects.reduce(
        (prev, cur) => prev.set(cur.name, cur.id),
        new Map<string, number>()
    )

    for (const task of taskData) {
        task.name
        task.description
        task.status
        moment(task.start_date.setHours(32, 1)).toDate()
        moment(task.deadline.setHours(32, 1)).toDate()

        await client.query(
            'INSERT INTO tasks (name, description, status, start_date, deadline, project_id, is_deleted) values ($1,$2,$3,$4,$5,$6,$7)',
            [task.name, task.description, task.status, task.start_date, task.deadline, projectMap.get(task.project), false]
        )
    }
    const taskQueryResult = await client.query<{ id: number; name: string }>
        ("SELECT id, name FROM tasks")
    const tasks = taskQueryResult.rows;
    const taskMap = tasks.reduce(
        (prev, cur) => prev.set(cur.name, cur.id),
        new Map<string, number>()
    )

    for (const subtask of subtaskData) {
        subtask.name
        subtask.description
        subtask.status

        await client.query(
            'INSERT INTO subtasks (name, description, status, task_id, user_id, is_deleted) values ($1,$2,$3,$4,$5,$6)',
            [subtask.name, subtask.description, subtask.status, taskMap.get(subtask.task), userMap.get(subtask.user), false]
        )
    }


    for (const comment of commentData) {
        comment.content
        await client.query(
            'INSERT INTO comments (content,user_id, task_id,is_deleted ) values ($1,$2,$3,$4)',
            [comment.content, userMap.get(comment.user), taskMap.get(comment.task), false]
        )
    }
    const commentQueryResult = await client.query<{ id: number; content: string }>
        ("SELECT id, content FROM comments")
    const comments = commentQueryResult.rows;
    const commentMap = comments.reduce(
        (prev, cur) => prev.set(cur.content, cur.id),
        new Map<string, number>()
    )

    for (const file of fileData) {
        file.name
        await client.query(
            'INSERT INTO files (name, comment_id, is_deleted) values ($1,$2,$3)',
            [file.name, commentMap.get(file.comment), false]
        )
            
        }




for (const userTask of userTaskData) {
    await client.query(
        'INSERT INTO user_task (task_id, user_id,is_deleted) values ($1,$2,$3)',
        [taskMap.get(userTask.task), userMap.get(userTask.user),false]
    )
}

for (const userProject of userProjectData) {
    await client.query(
        'INSERT INTO user_project (project_id, user_id,is_deleted) values ($1,$2,$3)',
        [projectMap.get(userProject.project), userMap.get(userProject.user),false]
    )
}


for (const admin of adminData) {
    const hashedAdminPassword = await hashPassword(admin.password.toString())
    admin.username
    await client.query(
        'INSERT INTO admin (username, password) values ($1,$2)',
        [admin.username, hashedAdminPassword]
    )
}


await client.end();
}

importData()
