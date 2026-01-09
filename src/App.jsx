import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Navlinks from "./components/Navlinks";
import Chatbox from "./components/Chatbox";
import Chatlist from "./components/Chatlist";
import Dashboard from "./components/Dashboard";
import { auth } from "./firebase/firebase";
import PhoneAuth from "./components/PhoneAuth";

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [usePhoneLogin, setUsePhoneLogin] = useState(false); // 📱 Toggle for Phone Login

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        showChat ? (
          <div className="flex lg:flex-row flex-col items-start w-[100%]">
            <Navlinks />
            <Chatlist setSelectedUser={setSelectedUser} />
            <Chatbox selectedUser={selectedUser} />
          </div>
        ) : (
          <Dashboard onStartChat={() => setShowChat(true)} />
        )
      ) : (
        <div>
          {/* Toggle between phone and email login */}
          <div style={{ textAlign: "center", margin: "1rem" }}>
            <button
              onClick={() => setUsePhoneLogin(false)}
              style={{
                marginRight: "10px",
                padding: "6px 16px",
                backgroundColor: usePhoneLogin ? "#eee" : "#007bff",
                color: usePhoneLogin ? "#000" : "#fff",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Email Login
            </button>
            <button
              onClick={() => setUsePhoneLogin(true)}
              style={{
                padding: "6px 16px",
                backgroundColor: usePhoneLogin ? "#007bff" : "#eee",
                color: usePhoneLogin ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Phone Login
            </button>
          </div>

          {/* Show PhoneAuth or Email Login/Register */}
          {usePhoneLogin ? (
            <PhoneAuth onLoginSuccess={() => window.location.reload()} />
          ) : isLogin ? (
            <Login isLogin={isLogin} setIsLogin={setIsLogin} />
          ) : (
            <Register isLogin={isLogin} setIsLogin={setIsLogin} />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
