import axios from "axios";
const baseUrl = "http://192.168.1.7:3001";

export default async function getSheets(jwtToken: string) {
  return await axios.get(`${baseUrl}/api/v1/get-sheets`, {
    headers: {
      "Authorization": `${jwtToken}`
    }
  })
}