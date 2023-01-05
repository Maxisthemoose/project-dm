import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.json";

export default function auth(req: Request, res: Response, next: NextFunction) {

  const auth = req.headers.authorization!.split(" ");
  const bearer = auth[0];
  const token = auth[1];
  if (bearer !== "Bearer") return res.status(401).send({ error: "Not bearer" });

  try {
    const user = jwt.verify(token, config["jwt-secret"]);
    if (!user) return res.status(401).send({ message: "User is not authenticated" })
  } catch (err) {
    return res.status(500).send({ message: err });
  }

}
