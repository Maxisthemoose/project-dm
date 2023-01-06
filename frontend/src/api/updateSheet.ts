import axios from "axios";
import { DnDCharacter } from "dnd-character-sheets";
const baseUrl = "http://192.168.0.200:3001";

export default async function updateSheet(character: DnDCharacter, jwtToken: string, id: string) {
  return await axios.patch(`${baseUrl}/api/v1/save-sheet/${id}`, character, {
    headers: {
      "Authorization": `${jwtToken}`
    }
  });
}