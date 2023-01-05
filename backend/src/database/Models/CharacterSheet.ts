import { model, Schema } from "mongoose";


const CharacterSheet = new Schema({
  data: Object,
});

export default model("character-sheet", CharacterSheet);