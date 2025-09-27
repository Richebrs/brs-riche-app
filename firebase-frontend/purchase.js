// Après validation d'un achat par l'utilisateur
async function handlePurchase(userId, purchaseAmount, purchaseType) {
  const db = firebase.firestore();
  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) return console.error("Utilisateur non trouvé !");
  const userData = userSnap.data();

  // Parrains
  const sponsor1 = userData.sponsor1;
  const sponsor2 = userData.sponsor2;
  const sponsor3 = userData.sponsor3;

  const bonuses = [
    { level: 1, sponsor: sponsor1, percent: 0.15 },
    { level: 2, sponsor: sponsor2, percent: 0.025 },
    { level: 3, sponsor: sponsor3, percent: 0.025 }
  ];

  for (const b of bonuses) {
    if (b.sponsor) {
      const bonusAmount = purchaseAmount * b.percent;

      // 🔹 Transaction Firestore pour éviter double écriture
      const sponsorRef = db.collection("users").doc(b.sponsor);
      await db.runTransaction(async (tx) => {
        const sponsorDoc = await tx.get(sponsorRef);
        if (!sponsorDoc.exists) return;

        const wallet = sponsorDoc.data().wallet || { balance: 0, totalGains: 0 };
        const newBalance = (wallet.balance || 0) + bonusAmount;
        const newTotalGains = (wallet.totalGains || 0) + bonusAmount;

        tx.update(sponsorRef, {
          "wallet.balance": newBalance,
          "wallet.totalGains": newTotalGains
        });

        // Historique bonus
        const bonusRef = db.collection("referralBonuses").doc();
        tx.set(bonusRef, {
          fromUser: userId,
          toUser: b.sponsor,
          level: b.level,
          amount: bonusAmount,
          purchaseType: purchaseType,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
    }
  }

  console.log("Bonus de parrainage distribué !");
}
