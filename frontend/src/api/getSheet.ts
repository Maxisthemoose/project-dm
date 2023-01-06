import axios from "axios";
const baseUrl = "http://192.168.0.200:3001";

export default async function getSheet(jwtToken: string, _id: string) {
  return await axios.get(`${baseUrl}/api/v1/get-sheet/${_id}`, {
    headers: {
      "Authorization": `${jwtToken}`
    }
  })
}