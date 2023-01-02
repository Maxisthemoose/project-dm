import mongoose from "mongoose";

mongoose.connect("mongodb+srv://User:1nMqk8xdUrVbcnOQ@cluster0.gr3dp.mongodb.net/?retryWrites=true&w=majority", {}, (err) => {
  if (err) console.log(err)
  else console.log("Logged into mongodb")
});