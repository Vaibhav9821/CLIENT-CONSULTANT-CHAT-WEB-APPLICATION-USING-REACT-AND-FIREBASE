// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import EmployeeManager from "./EmployeeManager";
import { useUserAuth } from "../context/UserAuthContext";
const Dashboard = ({ onStartChat }) => {
  const user = auth.currentUser;
  const [userName, setUserName] = useState("");
  const { logOut } = useUserAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().name || docSnap.data().fullName || "");
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-green-800">
          Welcome Aboard!
        </h1>
        <p className="text-gray-600 mb-6">
          Email/Phone: {user?.email || user?.phoneNumber}
        </p>
        <div className="flex gap-4">
        <button
          onClick={onStartChat}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow"
        >
          Chat
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow"
        >
          Logout
        </button>
      </div>

        
        <EmployeeManager />
      </div>

      
      <div className="flex gap-4 mt-8">
        <button
          onClick={onStartChat}
          className="bg-[#01AA85] text-white px-6 py-2 rounded hover:bg-[#01896d] transition"
        >
          Go to Chat
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
