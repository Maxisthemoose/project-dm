import axios from "axios";
const baseUrl = "http://192.168.0.200:3001";

export default async function login(userData: { usernameOrEmail?: string, username?: string, email?: string, password: string }) {
  try {
    return await axios.post(`${baseUrl}/api/v1/login`, userData);
  } catch (err) {
    return err;
  }
}