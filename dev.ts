import dotenv from 'dotenv'
import pg from "pg";
import { hashPassword } from './hash';

dotenv.config()

async function importData() {
    const client = new pg.Client({
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    });
    await client.connect();

    await client.query("DELETE FROM users");
    const name = "shawn"
    const username = "shawn"
    const password = "123"
    const title = "god"
    const is_manager = true


    const hashedUserPassword = await hashPassword(password)
    await client.query('INSERT INTO users (name, username, password, title, is_manager, is_deleted) values ($1,$2,$3,$4,$5,$6)',[name,username,hashedUserPassword,title,is_manager,false])
    await client.end();}

    importData()