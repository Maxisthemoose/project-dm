import { Router } from "express";
import config from "../config/config.json";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../database/Models/User";
const router = Router();

router.post("/api/v1/login", async (req, res) => {
  const { username, password, email, usernameOrEmail } = req.body;
  let user;

  if (!username && !email) {
    user = await User.findOne({ username: usernameOrEmail });
    if (!user) user = await User.findOne({ email: usernameOrEmail });
  } else
    user = await User.findOne({ email, username });

  if (!user) return res.status(404).send({ message: "Username or email is incorrect" });

  const passValid = bcrypt.compareSync(password, user.password!);

  if (!passValid) return res.status(401).send({ message: "Password is incorrect", accessToken: null });


  const token = jwt.sign({ id: user.id, email: user.email }, config["jwt-secret"], { expiresIn: 1000 * 60 * 60 * 24 });
  const v = jwt.verify(token, config["jwt-secret"]);
  console.log(v);

  return res.status(200).send({
    // message: "Success",
    accessToken: token,
    id: user._id,
    username: user.username,
    email: user.email,
    expiresIn: 1000 * 60 * 60 * 24,
  });

});

export default router;