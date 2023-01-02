import { NextFunction, Request, Response } from "express"
import User from "../database/Models/User"

export const checkDuplicateUser = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  const user = (await User.findOne({ username: data.username })) || (await User.findOne({ email: data.email }));

  if (user) return res.sendStatus(400).json({ error: "User already exists" });

  next();

}