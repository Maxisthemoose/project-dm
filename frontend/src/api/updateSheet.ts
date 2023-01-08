import axios from "axios";
import { DnDCharacter } from "dnd-character-sheets";

export default async function updateSheet(character: DnDCharacter, jwtToken: string, id: string) {
  return await axios.patch(`${process.env.REACT_APP_BASE_URL!}/api/v1/save-sheet/${id}`, character, {
    headers: {
      "Authorization": `${jwtToken}`
    }
  });
}