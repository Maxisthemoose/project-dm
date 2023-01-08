import axios from "axios";

export default async function getSheets(jwtToken: string) {
  return await axios.get(`${process.env.REACT_APP_BASE_URL!}/api/v1/get-sheets`, {
    headers: {
      "Authorization": `${jwtToken}`
    }
  })
}