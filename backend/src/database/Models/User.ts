import { model, Schema } from "mongoose";
import CharacterSheet from "./CharacterSheet";

const User = new Schema({
  username: String,
  password: String,
  email: String,
  characterSheets: [Schema.Types.ObjectId],
});

export default model("User", User);