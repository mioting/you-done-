import fs from "fs";
import formidable from "formidable";
import path from "path";
import type { Request, Response, NextFunction } from "express";

// let counter = 0;
declare global {
  namespace Express {
    export interface Request {
      form: {
        fields: formidable.Fields;
        files: formidable.Files;
      };
    }
  }
}

// create folder if does not exists
const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFiles: 1,
  maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB
  // filename: (name, oriext, part, form) => {
  //   counter++;
  //   let fieldname = part.name;
  //   let datetime = Date.now();
  //   let ext = part.mimetype?.split("/").pop();
  //   return `${fieldname}-${datetime}-${counter}.${ext}`;
  // },
});

export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({ message: "cannot upload file" });
      return;
    }
    req.form = { fields, files };
    console.log(files, "this is files");

    next();
  });
};
