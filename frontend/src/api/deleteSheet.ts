import axios from "axios";
export default async function deleteSheet(jwt: string, _id: string) {
  return await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/delete-sheet/${_id}`, {
    headers: {
      "Authorization": jwt,
    }
  });
}