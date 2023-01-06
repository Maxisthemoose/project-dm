import axios from "axios";
const baseUrl = "http://192.168.0.200:3001";

export default async function signup(userData: { username: string, password: string, email: string }) {
  try {
    return await axios.post(`${baseUrl}/api/v1/signup`, userData);
  } catch (err) {
    return err;
  }
}