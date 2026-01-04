import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.194:3000/graph",
  headers: { "Content-Type": "application/json" }
});

export default API;
