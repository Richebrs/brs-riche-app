/**
 * Initialisation complète BRS Riche Firestore
 * - Crée admin + utilisateurs test
 * - Crée collections : wallets, hotels, residences, transactions, referrals
 * - Configure rôles, gains, dates, images, parrainages
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function init() {
  try {
    console.log("🔥 Initialisation BRS Riche Firestore...");

    // --- USERS ---
    const usersData = [
      { username: "admin", email: "admin@brs.com", password: "Admin123", role: "admin", referralCode: null },
      { username: "roland", email: "roland@gmail.com", password: "Password123", role: "user", referralCode: null },
      { username: "marie", email: "marie@gmail.com", password: "Password123", role: "user", referralCode: "ROLAND123" },
    ];

    for (let u of usersData) {
      // Créer auth user
      let userRecord;
      try {
        userRecord = await admin.auth().getUserByEmail(u.email);
        console.log(`Utilisateur déjà existant : ${u.email}`);
      } catch {
        userRecord = await admin.auth().createUser({
          email: u.email,
          password: u.password,
          displayName: u.username
        });
        console.log(`Utilisateur créé : ${u.email}`);
      }

      // Firestore user
      const userDoc = db.collection("users").doc(userRecord.uid);
      await userDoc.set({
        username: u.username,
        email: u.email,
        role: u.role,
        referralCode: u.referralCode,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // Wallet initial
      const walletDoc = db.collection("wallets").doc(userRecord.uid);
      await walletDoc.set({ balance: 0, withdrawn: 0 }, { merge: true });
    }

    // --- HOTELS ---
    const hotels = [
      { name: "Hotel Lux", dailyPercent: 0.02, price: 100, imageUrl: "https://example.com/hotel1.jpg", durationDays: 30 },
      { name: "Hotel Comfort", dailyPercent: 0.015, price: 50, imageUrl: "https://example.com/hotel2.jpg", durationDays: 15 }
    ];

    for (let h of hotels) {
      const docRef = db.collection("hotels").doc();
      await docRef.set({
        ...h,
        dailyGain: h.price * h.dailyPercent,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // --- RESIDENCES ---
    const residences = [
      { name: "Résidence Alpha", dailyPercent: 0.03, price: 200, imageUrl: "https://example.com/res1.jpg", durationDays: 60 },
      { name: "Résidence Beta", dailyPercent: 0.025, price: 150, imageUrl: "https://example.com/res2.jpg", durationDays: 45 }
    ];

    for (let r of residences) {
      const docRef = db.collection("residences").doc();
      await docRef.set({
        ...r,
        dailyGain: r.price * r.dailyPercent,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // --- PARRAINAGES ---
    console.log("💡 Création parrainages niveau 3 pour les utilisateurs...");
    const allUsers = await db.collection("users").get();
    for (let doc of allUsers.docs) {
      const user = doc.data();
      let referrals = [];
      if (user.referralCode) {
        referrals.push({ level: 1, referredBy: user.referralCode });
      }
      await db.collection("referrals").doc(doc.id).set({ referrals }, { merge: true });
    }

    console.log("✅ Initialisation terminée !");
  } catch (err) {
    console.error("❌ Erreur lors de l'initialisation : ", err);
  }
}

init();
