import { Router } from "express";

const router = Router();
import User from "../database/Models/User";
import bcrypt from "bcryptjs";
import { checkDuplicateUser } from "../middleware/verifySignUp";

router.post("/api/v1/signup", checkDuplicateUser, async (req, res) => {
  console.log(req.body);

  const { username, email, password } = req.body;

  const user = new User({
    username,
    email,
    password: bcrypt.hashSync(password),
  });

  try {
    await user.save();
    return res.status(200).json({ created: true });
  } catch (err) {
    return res.status(500).json({ message: err, created: false });
  }


});


export default router;