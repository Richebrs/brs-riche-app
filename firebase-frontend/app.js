import { auth, db } from "./firebase-config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Connexion Google
document.getElementById("btn-login").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
});

document.getElementById("btn-logout").addEventListener("click", async () => {
  await signOut(auth);
});

// Observer état utilisateur
onAuthStateChanged(auth, async (user) => {
  const btnLogin = document.getElementById("btn-login");
  const btnLogout = document.getElementById("btn-logout");
  const userInfo = document.getElementById("user-info");

  if (user) {
    btnLogin.style.display = "none";
    btnLogout.style.display = "inline-block";
    userInfo.innerHTML = `<p>Connecté : ${user.email}</p>`;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        username: user.displayName || user.email.split("@")[0],
        role: "user",
        balanceAvailable: 0,
        balanceWithdrawn: 0,
        balanceTotal: 0,
        sponsor: null,
        createdAt: serverTimestamp()
      });
    }
  } else {
    btnLogin.style.display = "inline-block";
    btnLogout.style.display = "none";
    userInfo.innerHTML = `<p>Aucun utilisateur connecté</p>`;
  }
});
