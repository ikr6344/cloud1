const admin = require('firebase-admin');
const db = admin.firestore();

// Fonction pour créer un nouvel étudiant
exports.createEtudiant = async (req, res) => {
  try {
    const { nom, prenom, dateNaissance, CIN, CNE, email, motDePasse, photo, filiereId } = req.body;

    // Vérifier si la filière existe
    const filiereRef = db.collection('filiere').doc(filiereId);
    const filiereDoc = await filiereRef.get();
    if (!filiereDoc.exists) {
      return res.status(404).json({ error: 'La filière spécifiée n\'existe pas.' });
    }

    // Ajouter un nouvel étudiant à la collection "users" dans Firestore
    const etudiantRef = await db.collection('users').add({
      nom: nom,
      prenom: prenom,
      dateNaissance: dateNaissance,
      CIN: CIN,
      CNE: CNE,
      email: email,
      motDePasse: motDePasse,
      photo: photo,
      filiere: filiereRef  // Référence directe vers la filière
    });

    res.status(201).json({ message: 'Étudiant créé avec succès !', id: etudiantRef.id });
  } catch (error) {
    console.error('Erreur lors de la création de l\'étudiant :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création de l\'étudiant.' });
  }
};

// Fonction pour récupérer tous les étudiants
exports.getAllEtudiants = async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const etudiants = [];
    snapshot.forEach(doc => {
      etudiants.push({ id: doc.id, ...doc.data() });
    });
    res.json(etudiants);
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des étudiants.' });
  }
};

// Fonction pour récupérer un étudiant par son ID
exports.getEtudiantById = async (req, res) => {
  try {
    const etudiantId = req.params.id;
    const etudiantDoc = await db.collection('users').doc(etudiantId).get();

    if (!etudiantDoc.exists) {
      res.status(404).json({ error: 'Étudiant non trouvé.' });
    } else {
      res.json({ id: etudiantDoc.id, ...etudiantDoc.data() });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'étudiant :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'étudiant.' });
  }
};

// Fonction pour mettre à jour un étudiant par son ID
exports.updateEtudiant = async (req, res) => {
  // Logique pour mettre à jour un étudiant
};

// Fonction pour supprimer un étudiant par son ID
exports.deleteEtudiant = async (req, res) => {
  // Logique pour supprimer un étudiant
};

module.exports = exports;
