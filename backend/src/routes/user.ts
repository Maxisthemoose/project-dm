import { Router } from "express";
import jwt from "jsonwebtoken";
const router = Router();

router.get("/api/v1/user", (req, res) => {

  const jwtToken = req.headers.authorization;
  console.log(jwtToken);

});

export default router;