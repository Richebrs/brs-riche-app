<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Initialiser Utilisateur - BRS RICHE</title>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
</head>
<body>
<h1>Initialisation utilisateur BRS RICHE</h1>
<script>
// --- Configuration Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyCxna2jjk_5BKXnsCmJmwFsM388DeFUcNQ",
  authDomain: "brs-riche-2.firebaseapp.com",
  projectId: "brs-riche-2"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- Fonction pour créer un nouvel utilisateur ---
async function initializeUser({username, email, password, role = 'user', referralCode = null}) {
  try {
    // 1️⃣ Créer utilisateur Firebase Auth
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // 2️⃣ Ajouter infos Firestore - users
    await db.collection('users').doc(user.uid).set({
      username,
      email,
      role,
      referralCode,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      wallet: {
        balance: 0,
        totalGains: 0,
        totalWithdrawn: 0
      }
    });

    // 3️⃣ Créer document vide pour parrainage
    await db.collection('referrals').doc(user.uid).set({
      level1: [],
      level2: [],
      level3: [],
      totalBonus: 0
    });

    // 4️⃣ Créer documents vides pour hôtels et résidences
    await db.collection('hotels').doc(user.uid).set({
      hotelsList: []
    });
    await db.collection('residences').doc(user.uid).set({
      residencesList: []
    });

    // 5️⃣ Créer document vide transactions
    await db.collection('transactions').doc(user.uid).set({
      transactions: []
    });

    console.log(`✅ Utilisateur ${username} créé avec succès !`);
    alert(`Utilisateur ${username} créé avec succès !`);

  } catch (error) {
    console.error("❌ Erreur :", error.message);
    alert("Erreur : " + error.message);
  }
}

// --- Exemple d'utilisation ---
initializeUser({
  username: "Divine",
  email: "divine@gmail.com",
  password: "Password123",
  role: "user",
  referralCode: null
});
</script>
</body>
</html>
  
