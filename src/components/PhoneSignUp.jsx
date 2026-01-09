import React, { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const PhoneSignUp = ({ onLoginSuccess }) => {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Setup reCAPTCHA
  const setUpRecaptha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!number || !name) {
      setError("Please enter both a username and a valid phone number");
      return;
    }

    try {
      setUpRecaptha();
      const result = await signInWithPhoneNumber(auth, number, window.recaptchaVerifier);
      setConfirmationResult(result);
      setShowOtpInput(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp) return;
    try {
      const userCredential = await confirmationResult.confirm(otp);
      const user = userCredential.user;

      // Save the username in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: name,
        username: name.toLowerCase().replace(/\s+/g, ""), 
        phone: number,
        email: user.email || "",
        loginMethod: "phone",
        createdAt: serverTimestamp(),
});


      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Sign in with Phone
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {!showOtpInput ? (
          <form onSubmit={handleSendOtp}>
            <input
              type="text"
              placeholder="Enter Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full mb-4"
            />

            <PhoneInput
              defaultCountry="IN"
              value={number}
              onChange={setNumber}
              className="border p-2 w-full mb-4"
            />
            <div id="recaptcha-container"></div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 w-full mb-4"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PhoneSignUp;
