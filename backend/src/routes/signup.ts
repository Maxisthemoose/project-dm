import { Router } from "express";

const router = Router();
import User from "../database/Models/User";
import bcrypt from "bcryptjs";
import { checkDuplicateUser } from "../middleware/verifySignUp";

router.post("/api/v1/signup", checkDuplicateUser, async (req, res) => {
  console.log(req.body);

  const { username, email, password } = req.body;
  console.log("before pass");
  const user = new User({
    username,
    email,
    password: bcrypt.hashSync(password),
  });
  console.log("after pass");
  try {
    await user.save();
    console.log("What");
    return res.status(200).json({ created: true });
  } catch (err) {
    return res.status(500).json({ message: err, created: false });
  }


});


export default router;