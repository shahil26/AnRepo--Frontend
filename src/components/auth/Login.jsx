/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { LOGIN_SUCCESS, LOGIN_FAILURE } from "../../redux/actions/types"
import authService from "../../services/authService"
import {
  loadCaptchaEnginge,
  validateCaptcha,
  LoadCanvasTemplateNoReload,
} from "react-simple-captcha"
import { ArrowPathIcon } from "@heroicons/react/24/solid"
import { CgClose } from "react-icons/cg"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"


const Login = () => {
  const [instituteId, setInstituteId] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [userCaptcha, setUserCaptcha] = useState("")
  const [isGuidelinesAccepted, setIsGuidelinesAccepted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false)
  const [otpSent,setOtpSent]=useState(false);
  const [otpMessage,setOtpMessage]=useState(" ");
  const [loging,setLogging]=useState(true);


  const [otp,setOtp]=useState(" ");
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const error = useSelector((state) => state.auth.error)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
    loadCaptchaEnginge(6)
  }, [isAuthenticated, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("")
    if (!validateCaptcha(userCaptcha)) {
      setMessage("Invalid captcha code")
      return
    }


   if (!otpSent) {
      
      try {
        await authService.sendOtp(instituteId, email);
        setOtpSent(true);
        setMessage("OTP sent to your email.");
      } catch (error) {
        setMessage(error.response?.data?.message || error?.message || "An error occurred.");
      }
    } else {
      // If OTP has been sent, attempt login
      try {
        if (!otp) {
          setMessage("Please enter the OTP.");
          return;
        }
        const response = await authService.login(instituteId, email, password,otp);
        console.log(response);
        const payload = {
          instituteId: instituteId,
          email: email,
          token: response.token,
          roles: response.roles,
          name: response.name,
          image: response.image,
          keepunsaved: response.unsaved,
          otp: otp
        };

        dispatch({ type: LOGIN_SUCCESS, payload: payload });
        setMessage("Login successful! Redirecting to the dashboard...");
      } catch (error) {
        dispatch({
          type: LOGIN_FAILURE,
          payload: error.response?.data?.message || error?.message || error,
        });
        setMessage("Login failed.");
      }
    }
  };

   
  
  const GuidelinesModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 dark:bg-black">
        <div className="bg-white p-6 rounded-lg m-5 overflow-y-auto max-h-full dark:bg-gray-800 dark:text-white">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-4">Usage Guidelines</h2>
            <CgClose
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-red-200 p-[2px]"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">GDPR Guidelines</h3>
            <p>
              The General Data Protection Regulation (GDPR) is a regulation in
              EU law on data protection and privacy in the European Union and
              the European Economic Area. It also addresses the transfer of
              personal data outside the EU and EEA areas. The GDPR aims
              primarily to give control to individuals over their personal data
              and to simplify the regulatory environment for international
              business by unifying the regulation within the EU.
            </p>
            <h3 className="text-lg font-semibold mb-2 mt-4">
              FERPA Guidelines
            </h3>
            <p>
              The Family Educational Rights and Privacy Act (FERPA) is a federal
              law that protects the privacy of student education records. The
              law applies to all schools that receive funds under an applicable
              program of the U.S. Department of Education. FERPA gives parents
              certain rights with respect to their children&apos;s education
              records. These rights transfer to the student when he or she
              reaches the age of 18 or attends a school beyond the high school
              level.
            </p>
            <h3 className="text-lg font-semibold mb-2 mt-4">
              Terms and Conditions
            </h3>
            <p>
              By accessing or using our services, you agree to be bound by these
              terms and conditions. If you disagree with any part of the terms,
              then you may not access the service. We reserve the right to
              modify or replace these terms at any time. Your continued use of
              the service after any such changes constitutes your acceptance of
              the new terms.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 dark:bg-black">
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
          {/* Left Side */}
          <div className="md:block w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-900 dark:to-purple-800 p-8 flex items-center justify-center">
            <div className="text-white text-center dark:text-white-900">
              <h2 className="text-2xl font-bold mb-2">
                Welcome to the Annual Report Portal
              </h2>
              <p className="sm:text-m text-md">
                Powered by the Ministry of AYUSH, this portal provides easy
                access to annual reports and key resources.
              </p>

              <img src="/logo.png" alt="img" className="hidden md:block mt-4" />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-8 dark:bg-gray-800">
            <h2 className="sm:text-3xl text-lg font-bold text-center text-gray-800 mb-6 dark:text-white">
              Login to Your Account
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="text"
                  id="instituteId"
                  value={instituteId}
                  onChange={(e) => setInstituteId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  placeholder="Enter your institute ID"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  id="emailId"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  placeholder="Enter your email ID"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-600 dark:text-white"
                  placeholder="Password"
                />
                
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5" />
                  )}
                </button>
                
              </div>
              {/* <input
                  // type={showOtp ? "text" : "password"}
                  // name="otp"
                  // value={otp} 
                  // onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-600 dark:text-white"
                  placeholder="Enter One time password"
                /> */}
              <div className="captcha-container flex flex-col items-center space-y-3 my-4 ">
                <div className="w-full justify-between flex items-center border-2 gap-2 pt-1 dark:bg-white">
                  <LoadCanvasTemplateNoReload />
                  <button
                    type="button"
                    onClick={() => loadCaptchaEnginge(6)}
                    className="p-2 text-black hover:text-blue-500 transition-colors"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Enter Captcha"
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-between gap-1">
                <a
                  href="/create-password"
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Create Password
                </a>
                <a
                  href="/forgot-password"
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Forgot Password
                </a>
              </div>
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="guidelines"
                  checked={isGuidelinesAccepted}
                  onChange={(e) => setIsGuidelinesAccepted(e.target.checked)}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <label
                  htmlFor="guidelines"
                  className="text-sm text-gray-600 dark:text-white"
                >
                  I accept the{"   "}
                  <button
                    type="button"
                    onClick={() => setShowGuidelinesModal(true)}
                    className="text-blue-500 hover:text-blue-700 underline"
                  >
                    usage guidelines
                  </button>
                </label>
              </div>

              {/* Add modal at the bottom of the component */}
              <GuidelinesModal
                isOpen={showGuidelinesModal}
                onClose={() => setShowGuidelinesModal(false)}
              />
              
              {!otpSent && (
                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    Request OTP
                  </button>
                </div>
              )}

              {otpSent && (
                <>
                  <div>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      placeholder="Enter OTP"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  >
                    Verify and Login
                  </button>
                </>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {message || otpMessage}
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
