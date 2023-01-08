import axios from "axios";

export default async function getSheet(jwtToken: string, _id: string) {
  return await axios.get(`${process.env.REACT_APP_BASE_URL!}/api/v1/get-sheet/${_id}`, {
    headers: {
      "Authorization": `${jwtToken}`
    }
  })
}