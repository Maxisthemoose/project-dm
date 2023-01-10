import mongoose from "mongoose";
import { mongo_uri } from "../config/config.json";
mongoose.connect(mongo_uri, {}, (err) => {
  if (err) console.log(err)
  else console.log("Logged into mongodb")
});