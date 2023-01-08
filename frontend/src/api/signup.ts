import axios from "axios";

export default async function signup(userData: { username: string, password: string, email: string }) {
  try {
    return await axios.post(`${process.env.REACT_APP_BASE_URL!}/api/v1/signup`, userData);
  } catch (err) {
    return err;
  }
}