import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAA1PrRpiof862We2so2-Md9iiaPFtnjFA",
  authDomain: "vaibhav-48aeb.firebaseapp.com",
  databaseURL: "https://vaibhav-48aeb-default-rtdb.firebaseio.com",
  projectId: "vaibhav-48aeb",
  storageBucket: "vaibhav-48aeb.firebasestorage.app",
  messagingSenderId: "468129418865",
  appId: "1:468129418865:web:1c2faac41316b415bc95d0",
  measurementId: "G-2RB8EP04CZ",
};

export const provider = new GoogleAuthProvider();
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Used by PhoneAuth for invisible reCAPTCHA
 const generateRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container", // ID of the DOM element
      {
        size: "invisible",
        callback: (response) => {
          console.log("Recaptcha verified", response);
        },
      },
      auth // ✅ Pass the auth instance correctly here
    );
  }
};

// ✅ Used in PhoneAuth component
export { auth, db, generateRecaptcha, signInWithPhoneNumber };

// 👇 Your existing Firestore chat logic (unchanged)
export const listenForChats = (setChats) => {
  const chatsRef = collection(db, "chats");
  const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
    const chatList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    chatList.forEach((chat) => {
      if (!Array.isArray(chat.users)) {
        console.warn("⚠️ Chat has non-array users:", chat);
      }
    });

    const filteredChats = chatList.filter(
      (chat) =>
        Array.isArray(chat?.users) &&
        chat.users.some((user) => user.email === auth.currentUser?.email)
    );

    setChats(filteredChats);
  });

  return unsubscribe;
};

export const sendMessage = async (messageText, chatId, user1, user2) => {
  const chatRef = doc(db, "chats", chatId);

  const user1Doc = await getDoc(doc(db, "users", user1));
  const user2Doc = await getDoc(doc(db, "users", user2));

  const user1Data = user1Doc.data();
  const user2Data = user2Doc.data();

  const chatDoc = await getDoc(chatRef);
  if (!chatDoc.exists()) {
    await setDoc(chatRef, {
      users: [user1Data, user2Data],
      lastMessage: messageText,
      lastMessageTimestamp: serverTimestamp(),
    });
  } else {
    await updateDoc(chatRef, {
      lastMessage: messageText,
      lastMessageTimestamp: serverTimestamp(),
    });
  }

  const messageRef = collection(db, "chats", chatId, "messages");

  await addDoc(messageRef, {
    text: messageText,
    sender: auth.currentUser.email,
    timestamp: serverTimestamp(),
  });
};

export const listenForMessages = (chatId, setMessages) => {
  const chatRef = collection(db, "chats", chatId, "messages");
  onSnapshot(chatRef, (snapshot) => {
    const messages = snapshot.docs.map((doc) => doc.data());
    setMessages(messages);
  });
};
