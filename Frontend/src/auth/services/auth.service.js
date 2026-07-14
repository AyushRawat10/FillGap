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

const changeCurrentPassword = async ({ oldPassword, newPassword }) => {
  const response = await api.post("/api/v1/auth/change-password", {
    oldPassword,
    newPassword,
  });

  return response.data.data;
};

const forgotPassword = async ({ email }) => {
  const response = await api.post("/api/v1/auth/forgot-password", {
    email,
  });

  return response.data.data;
};

const resetPasswordVerification = async ({ resetToken, newPassword }) => {
  const response = await api.post(`/api/v1/auth/reset-password/${resetToken}`, {
    newPassword,
  });

  return response.data.data;
};

const emailVerification = async ({ verificationToken }) => {
  const response = await api.get(
    `/api/v1/auth/verify-email/${verificationToken}`,
  );

  return response.data.data;
};

const resendEmailVerification = async () => {
  const response = await api.post("/api/v1/auth/resend-email-verification")

  return response.data.data
}

export {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  changeCurrentPassword,
  forgotPassword,
  emailVerification,
  resetPasswordVerification,
  resendEmailVerification
};
