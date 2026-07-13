import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

const registerUser = async ({ username, email, password }) => {
  const response = await api.post("/api/v1/auth/register", {
    username,
    email,
    password,
  });
  return response.data.data;
};

const loginUser = async ({ email, password }) => {
  const response = await api.post("/api/v1/auth/login", {
    email,
    password,
  });
  
  return response.data.data;
};

const logoutUser = async () => {
  const response = await api.post("/api/v1/auth/logout");

  return response.data.data;
};

const getMe = async () => {
  const response = await api.get("/api/v1/auth/me");

  return response.data.data;
};

const changeCurrentPassword = async ({oldPassword, newPassword}) => {
  const response = await api.post("/api/v1/auth/change-password", {
    oldPassword,
    newPassword
  });

  return response.data.data;
}

export { registerUser, loginUser, logoutUser, getMe, changeCurrentPassword };
