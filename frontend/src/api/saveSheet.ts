import axios from "axios";
import { DnDCharacter } from "dnd-character-sheets";

export default async function saveSheet(character: DnDCharacter, jwtToken: string) {
  return await axios.post(`${process.env.REACT_APP_BASE_URL!}/api/v1/save-sheet`, character, {
    headers: {
      "Authorization": `${jwtToken}`
    }
  });
}