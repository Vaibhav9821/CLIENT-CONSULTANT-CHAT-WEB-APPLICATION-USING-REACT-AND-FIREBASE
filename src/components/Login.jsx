import React, { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate,Link } from "react-router-dom";

const Login = ({ isLogin, setIsLogin }) => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleChangeUserData = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailLogin = async () => {
    setIsLoading(true);
    try {
      await logIn(userData.email, userData.password);
      navigate("/"); //  to dashboard/chat
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      navigate("/"); // redirects to dashboard/chat
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center h-[100vh] background-image">
      <div className="bg-white shadow-lg p-5 rounded-xl h-auto w-[20rem] flex flex-col justify-center items-center">
        <div className="mb-10">
          <h1 className="text-center text-[28px] font-bold">Sign In</h1>
          <p className="text-center text-sm text-gray-400">Welcome back</p>
        </div>
        <div className="w-full">
          <input
            type="email"
            name="email"
            onChange={handleChangeUserData}
            className="border border-green-200 w-full p-2 rounded-md bg-[#01aa851d] text-[#004939f3] mb-3 font-medium outline-none"
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            onChange={handleChangeUserData}
            className="border border-green-200 w-full p-2 rounded-md bg-[#01aa851d] text-[#004939f3] mb-3 font-medium outline-none"
            placeholder="Password"
          />
        </div>
        <div className="w-full">
          <button
            disabled={isLoading}
            onClick={handleEmailLogin}
            className="bg-[#01aa85] text-white font-bold w-full p-2 rounded-md flex items-center gap-2 justify-center"
          >
            {isLoading ? "Processing..." : <>Login <FaSignInAlt /></>}
          </button>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="bg-red-500 text-white mt-3 font-bold w-full p-2 rounded-md flex items-center gap-2 justify-center"
          >
            Sign in with Google
          </button>

          {/* Phone Login */}
          <Link to="/phone-signup"
            className="bg-blue-500 text-white mt-3 font-bold w-full p-2 rounded-md flex items-center gap-2 justify-center"
          >
            Login with Phone
          </Link>
        </div>

        <div className="mt-5 text-center text-gray-400 text-sm">
          <button onClick={() => setIsLogin(!isLogin)}>
            Don't have an account yet? Sign Up
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
