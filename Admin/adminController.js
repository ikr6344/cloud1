const admin = require('firebase-admin');
const db = admin.firestore();

// Créer un nouvel administrateur
exports.createAdmin = async (req, res) => {
  try {
    const { nom, prenom, telephone, cin, photo, email, password } = req.body;

    // Vérifier si l'email est fourni dans le corps de la requête
    if (!email || !password) {
      return res.status(400).json({ error: 'L\'email et le mot de passe sont requis.' });
    }

    // Créer le compte d'authentification Firebase
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // Ajouter un nouvel administrateur à la collection "users" dans Firestore
    await db.collection('users').doc(userRecord.uid).set({
      nom: nom,
      prenom: prenom,
      telephone: telephone,
      cin: cin,
      photo: photo,
      role: 'admin',
      email: email,
      password:password,
      timeStamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ message: 'Administrateur créé avec succès !', id: userRecord.uid });
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création de l\'administrateur.' });
  }
};

// Récupérer tous les administrateurs
exports.getAllAdmins = async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('role', '==', 'admin').get();
    const admins = [];
    snapshot.forEach(doc => {
      admins.push({ id: doc.id, ...doc.data() });
    });
    res.json(admins);
  } catch (error) {
    console.error('Erreur lors de la récupération des administrateurs :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des administrateurs.' });
  }
};

// Récupérer un administrateur par son ID
exports.getAdminById = async (req, res) => {
  try {
    const adminId = req.params.id;
    const adminDoc = await db.collection('users').doc(adminId).get();

    if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
      res.status(404).json({ error: 'Administrateur non trouvé.' });
    } else {
      res.json({ id: adminDoc.id, ...adminDoc.data() });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'administrateur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'administrateur.' });
  }
};

// Mettre à jour un administrateur par son ID
exports.updateAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const { nom, prenom, telephone, cin, photo } = req.body;

    await db.collection('users').doc(adminId).update({
      nom: nom,
      prenom: prenom,
      telephone: telephone,
      cin: cin,
      photo: photo
    });

    res.json({ message: 'Administrateur mis à jour avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'administrateur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'administrateur.' });
  }
};

// Supprimer un administrateur par son ID
exports.deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    await db.collection('users').doc(adminId).delete();
    res.json({ message: 'Administrateur supprimé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'administrateur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'administrateur.' });
  }
};
