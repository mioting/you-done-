import express from "express";
import type { Request, Response } from "express";
import { dbClient } from "../server";
import { File } from "../models";
import { uploadMiddleware } from "../formidable";
export const fileRoutes = express.Router();

fileRoutes.post("/file", uploadMiddleware, createFile);
fileRoutes.delete("/file", deleteFile);
fileRoutes.get("/file", getFile);

async function createFile(req: Request, res: Response) {
  // const file = req.form.files;
  // const fileName = file.file["newFilename"]
  const task_id = req.form.fields.task_id;
  const content = req.form.fields.content;
  const fileName = req.form.files.fileInput["newFilename"];
  const commentId = (
    await dbClient.query(
      "INSERT INTO comments (content, task_id, user_id, is_deleted) VALUES ($1,$2,$3,$4) RETURNING id",
      [content, task_id, req.session.user_id, false]
    )
  ).rows;
  //   console.log("commendId: ", commentId);
  await dbClient.query<File>(
    "INSERT INTO files (name, is_deleted, comment_id) VALUES ($1,$2, $3)",
    [fileName, false, Number(commentId[0]["id"])]
  );

  res.json({ message: "ok" });
}

async function deleteFile(req: Request, res: Response) {
  const { id } = req.body;
  const queryResult = await dbClient.query<File>(
    "SELECT * FROM files WHERE (id,is_deleted) = ($1,$2)",
    [id, false]
  );
  const report = queryResult.rows[0];
  if (!report) {
    res.status(400).json({ message: "NO THIS FUCKING files" });
    return;
  }
  await dbClient.query<File>(
    "UPDATE files SET is_deleted = true WHERE id = $1",
    [id]
  );
  res.json({ message: "ok" });
}

async function getFile(req: Request, res: Response) {
  const queryResult = await dbClient.query<File[]>(
    "select name, comment_id from files inner join comments on comments.id = files.comment_id"
  );
  res.json(queryResult.rows);
}
