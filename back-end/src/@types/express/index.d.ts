import multer from "multer";

declare namespace Express {
  export interface Request {
    user_id: string;
    user_role: string;
    file?: Express.Multer.File;
  }
}
