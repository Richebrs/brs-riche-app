import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Exemple inscription
async function register(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Utilisateur inscrit:", userCredential.user);
  } catch (error) {
    console.error("Erreur inscription:", error.message);
  }
}

// Exemple login
async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Utilisateur connecté:", userCredential.user);
  } catch (error) {
    console.error("Erreur connexion:", error.message);
  }
}

// Exemple Firestore
async function addData() {
  try {
    await addDoc(collection(db, "testCollection"), {
      nom: "BRS Riche",
      date: new Date(),
    });
    console.log("Document ajouté avec succès !");
  } catch (error) {
    console.error("Erreur Firestore:", error.message);
  }
}

// Pour test rapide
document.querySelector("#registerBtn").addEventListener("click", () => {
  register("test@example.com", "password123");
});
document.querySelector("#loginBtn").addEventListener("click", () => {
  login("test@example.com", "password123");
});
document.querySelector("#addDataBtn").addEventListener("click", addData);
                  
