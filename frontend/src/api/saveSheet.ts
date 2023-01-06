import axios from "axios";
import { DnDCharacter } from "dnd-character-sheets";
const baseUrl = "http://192.168.0.200:3001";

export default async function saveSheet(character: DnDCharacter, jwtToken: string) {
  return await axios.post(`${baseUrl}/api/v1/save-sheet`, character, {
    headers: {
      "Authorization": `${jwtToken}`
    }
  });
}