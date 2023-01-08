import axios from "axios";

export default async function login(userData: { usernameOrEmail?: string, username?: string, email?: string, password: string }) {
  try {
    return await axios.post(`${process.env.REACT_APP_BASE_URL!}/api/v1/login`, userData);
  } catch (err) {
    return err;
  }
}