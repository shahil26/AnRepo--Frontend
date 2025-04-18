import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
  OTP_FAILURE,
  OTP_SENT,
} from "../../redux/actions/types";
import authService from "../../services/authService";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [instituteId, setInstituteId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await authService.sendOtp(instituteId,email);
      dispatch({ type: OTP_SENT });
      setStep(2);
      setMessage("OTP sent to your email");
    } catch (error) {
      dispatch({
        type: OTP_FAILURE,
        payload: error.response?.data?.message || "Error in sending OTP",
      });
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await authService.verifyOtp(instituteId, email, otp, newPassword);
      dispatch({ type: RESET_PASSWORD_SUCCESS });
      setMessage("Password reset successfully. Redirecting to login...");
      navigate("/login");
    } catch (error) {
      dispatch({
        type: RESET_PASSWORD_FAILURE,
        payload: error.response?.data?.message || "Error resetting password",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 dark:bg-black">
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
          {/* Left Side */}
          <div className="md:block w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex items-center justify-center dark:from-blue-900 dark:to-purple-800">
            <div className="text-white text-center">
              <h2 className="text-4xl font-bold mb-6">Enter Your Email!</h2>
              <p className="sm:text-lg text-md">
                You will receive an otp via email to reset your password.
              </p>
              <img
                src="/logo.png"
                alt="img"
                className=" hidden md:block mt-8"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 p-8 dark:bg-gray-800 ">
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <h2 className="sm:text-3xl text-lg font-bold text-center text-gray-800 mb-6 dark:text-white">
                  Forgot Password
                </h2>
                <input
                  type="text"
                  id="instituteId"
                  value={instituteId}
                  onChange={(e) => setInstituteId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600"
                  placeholder="Enter your institute ID"
                  required
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-4 dark:bg-gray-600"
                  placeholder="Enter your email"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg dark:bg-blue-700"
                >
                  Send OTP
                </button>
                {message && <p className="text-green-500 mt-2">{message}</p>}
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleOtpSubmit}>
                <h2 className="text-3xl font-bold text-center text-gray-800">
                  Verify OTP and Reset Password
                </h2>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  placeholder="Enter the OTP"
                  required
                />
                <div className="relative mb-4">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="New Password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <AiOutlineEyeInvisible className="h-5 w-5" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="relative mb-4">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Confirm Password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible className="h-5 w-5" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg"
                >
                  Reset Password
                </button>
                {message && <p className="text-green-500 mt-2">{message}</p>}
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </form>
            )}
            <div className="flex items-center justify-between py-2 gap-1">
              <a
                href="/login"
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Login
              </a>
              <a
                href="/create-password"
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Create Password
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
