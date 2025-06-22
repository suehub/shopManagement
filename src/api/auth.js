import axios from "axios";

export async function login({ userId, password }) {
  const response = await axios.post("http://localhost:8080/api/v1/auth/login", {
    userId,
    password,
  });
  return response.data;
}
