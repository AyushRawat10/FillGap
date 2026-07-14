import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  changeCurrentPassword,
  forgotPassword,
  emailVerification,
  resetPasswordVerification,
  resendEmailVerification,
} from "../services/auth.service.js";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await registerUser({ username, email, password });
      setUser(data.user);
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      setUser(data.user);
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logoutUser();
      setUser(null);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCurrentPassword = async ({ oldPassword, newPassword }) => {
    setLoading(true);
    try {
      const data = await changeCurrentPassword({ oldPassword, newPassword });
    } catch (error) {
      console.log("handleChangeCurrentPassword : ", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async ({ email }) => {
    setLoading(true);
    try {
      const data = await forgotPassword({ email });
    } catch (error) {
      console.log("handleForgotPassword : ", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordVerification = async ({token, newPassword}) => {
    setLoading(true)
    try {
      const data = await resetPasswordVerification({resetToken: token, newPassword})
      return data;
    } catch (error) {
      console.log("handleResetPasswordVerification : ", error)
      throw error;
    } finally {
      setLoading(false)
    }
  }

  const handleEmailVerification = async ({ token }) => {
    setLoading(true);
    try {
      const data = await emailVerification({verificationToken: token});
      return data
    } catch (error) {
      console.log("handleEmailVerification : ", error);
      throw error;
    } finally {
      setLoading(false);
    }

  };

  const handleResendEmailVerification = async () => {
    try {
      await resendEmailVerification()
    } catch (error) {
      console.log("handleResendEmailVerification : ", error)
      throw error
    } 
  }

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleLogout,
    handleChangeCurrentPassword,
    handleForgotPassword,
    handleEmailVerification,
    handleResetPasswordVerification,
    handleResendEmailVerification
  };
};
