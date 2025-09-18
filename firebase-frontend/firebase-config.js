// 🔹 Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCxna2jjk_5BKXnsCmJmwFsM388DeFUcNQ",
  authDomain: "brs-riche-2.firebaseapp.com",
  projectId: "brs-riche-2",
  storageBucket: "brs-riche-2.appspot.com",
  messagingSenderId: "313874599780",
  appId: "1:313874599780:web:TON_APP_ID"
};

// 🔹 Initialisation Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
