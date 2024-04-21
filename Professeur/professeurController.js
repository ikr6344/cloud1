const admin = require('firebase-admin');
const db = admin.firestore();

// Fonction pour créer un nouveau professeur
exports.createProf = async (req, res) => {
  try {
    const { nom, prenom, CIN, telephone, photo, specialite, email } = req.body;

    // Vérifier si l'email et le mot de passe sont fournis
    if (!email || !CIN) {
      return res.status(400).json({ error: 'L\'email et le mot de passe sont requis.' });
    }

    // Créer le compte d'authentification Firebase
    const userRecord = await admin.auth().createUser({
      email: email,
      password: CIN + prenom,
    });

    // Ajouter un nouveau professeur à la collection "users" dans Firestore
    const profRef = await db.collection('users').doc(userRecord.uid).set({
      nom: nom,
      prenom: prenom,
      telephone: telephone,
      role: 'prof',
      photo: photo,
      CIN: CIN,
      specialite: specialite,
      email: email,
      motDePasse: CIN + prenom,
      authUserId: userRecord.uid,
      timeStamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ message: 'Professeur créé avec succès !', id: profRef.id });
  } catch (error) {
    console.error('Erreur lors de la création du professeur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création du professeur.' });
  }
};

exports.getAllProfs = async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('role', '==', 'prof').get();
    const profs = [];
    snapshot.forEach(doc => {
      profs.push({ id: doc.id, ...doc.data() });
    });
    res.json(profs);
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des professeurs.' });
  }
};
exports.getProfById = async (req, res) => {
  try {
    const profId = req.params.id;
    const profDoc = await db.collection('users').doc(profId).get();

    if (!profDoc.exists) {
      res.status(404).json({ error: 'Professeur non trouvé.' });
    } else {
      const profData = profDoc.data();
      if (profData.role !== 'prof') {
        res.status(404).json({ error: 'L\'utilisateur spécifié n\'est pas un professeur.' });
      } else {
        res.json({ id: profDoc.id, ...profData });
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du professeur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du professeur.' });
  }
};
exports.updateProf = async (req, res) => {
  try {
    const profId = req.params.id;
    const { nom, prenom, telephone, photo, specialite } = req.body;

    await db.collection('users').doc(profId).update({
      nom: nom,
      prenom: prenom,
      telephone: telephone,
      photo: photo,
      specialite: specialite
    });

    res.json({ message: 'Professeur mis à jour avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du professeur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du professeur.' });
  }
};
exports.deleteProf = async (req, res) => {
  try {
    const profId = req.params.id;

    // Fetch the professor document from Firestore
    const profDoc = await db.collection('users').doc(profId).get();

    // Check if the professor document exists
    if (!profDoc.exists) {
      return res.status(404).json({ error: 'Professeur non trouvé.' });
    }

    // Get the authentication user ID associated with the professor document
    const authUserId = profDoc.data().authUserId;

    // Delete the professor document from Firestore
    await db.collection('users').doc(profId).delete();

    // Delete the authentication user record from Firebase Authentication
    await admin.auth().deleteUser(authUserId);

    res.json({ message: 'Professeur supprimé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la suppression du professeur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du professeur.' });
  }
};

