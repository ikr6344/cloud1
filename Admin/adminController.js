const admin = require('firebase-admin');
const db = admin.firestore();

// Créer un nouvel administrateur
exports.createAdmin = async (req, res) => {
  try {
    const { nom, prenom, telephone, cin, photo } = req.body;

    // Vérifier si l'email est fourni dans le corps de la requête
    if (!req.body.email) {
      return res.status(400).json({ error: 'L\'email est requis.' });
    }

    // Ajouter un nouvel administrateur à la collection "admins" dans Firestore
    const adminRef = await db.collection('admins').add({
      nom: nom,
      prenom: prenom,
      telephone: telephone,
      cin: cin,
      photo: photo,
      role: 'admin',
      email: req.body.email
    });

    res.status(201).json({ message: 'Administrateur créé avec succès !', id: adminRef.id });
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création de l\'administrateur.' });
  }
};

// Récupérer tous les administrateurs
exports.getAllAdmins = async (req, res) => {
  try {
    const snapshot = await db.collection('admins').get();
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
    const adminDoc = await db.collection('admins').doc(adminId).get();

    if (!adminDoc.exists) {
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

    await db.collection('admins').doc(adminId).update({
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
    await db.collection('admins').doc(adminId).delete();
    res.json({ message: 'Administrateur supprimé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'administrateur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'administrateur.' });
  }
};
