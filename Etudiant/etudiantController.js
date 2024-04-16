const admin = require('firebase-admin');
const db = admin.firestore();

// Fonction pour créer un nouvel étudiant
exports.createEtudiant = async (req, res) => {
  try {
    const { nom, prenom, dateNaissance, CIN, CNE, email, motDePasse, photo, filiereId, role } = req.body;

    // Vérifier si la filière existe
    const filiereRef = db.collection('filiere').doc(filiereId);
    const filiereDoc = await filiereRef.get();
    if (!filiereDoc.exists) {
      return res.status(404).json({ error: 'La filière spécifiée n\'existe pas.' });
    }

    // Créer le compte d'authentification Firebase
    const userRecord = await admin.auth().createUser({
      email: email,
      password: motDePasse,
    });

    // Ajouter un nouvel étudiant à la collection "users" dans Firestore
    const etudiantRef = await db.collection('users').doc(userRecord.uid).set({
      nom: nom,
      prenom: prenom,
      dateNaissance: dateNaissance,
      CIN: CIN,
      CNE: CNE,
      email: email,
      motDePasse: motDePasse,
      role: "etudiant",
      photo: photo,
      filiere: filiereRef // Référence directe vers la filière
    });

    res.status(201).json({ message: 'Étudiant créé avec succès !', id: etudiantRef.id });
  } catch (error) {
    console.error('Erreur lors de la création de l\'étudiant :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création de l\'étudiant.' });
  }
};

// Récupérer tous les étudiants
exports.getAllEtudiants = async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('role', '==', 'etudiant').get();
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

// Récupérer un étudiant par son ID
exports.getEtudiantById = async (req, res) => {
  try {
    const etudiantId = req.params.id;
    const etudiantDoc = await db.collection('users').doc(etudiantId).get();

    if (!etudiantDoc.exists || etudiantDoc.data().role !== 'etudiant') {
      res.status(404).json({ error: 'Étudiant non trouvé.' });
    } else {
      res.json({ id: etudiantDoc.id, ...etudiantDoc.data() });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'étudiant :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'étudiant.' });
  }
};

// Mettre à jour un étudiant par son ID
exports.updateEtudiant = async (req, res) => {
  try {
    const etudiantId = req.params.id;
    const { nom, prenom, dateNaissance, CIN, CNE, email, motDePasse, photo, filiereRef } = req.body;

    // Vérifier si la filière existe
    const filiereDoc = await filiereRef.get();
    if (!filiereDoc.exists) {
      return res.status(404).json({ error: 'La filière spécifiée n\'existe pas.' });
    }

    await db.collection('users').doc(etudiantId).update({
      nom: nom,
      prenom: prenom,
      dateNaissance: dateNaissance,
      CIN: CIN,
      CNE: CNE,
      email: email,
      motDePasse: motDePasse,
      photo: photo,
      filiereRef: filiereRef
    });

    res.json({ message: 'Étudiant mis à jour avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'étudiant :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'étudiant.' });
  }
};

// Supprimer un étudiant par son ID
exports.deleteEtudiant = async (req, res) => {
  try {
    const etudiantId = req.params.id;
    await db.collection('users').doc(etudiantId).delete();
    res.json({ message: 'Étudiant supprimé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'étudiant :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'étudiant.' });
  }
};
// etudiantController.js

// Récupérer tous les étudiants d'une filière spécifique
exports.getEtudiantsByFiliere = async (req, res) => {
  try {
    const filiereId = req.params.id; // Récupérer l'ID de la filière depuis les paramètres de la requête

    // Effectuer une requête pour récupérer tous les étudiants de la filière spécifiée
    const snapshot = await db.collection('users').where('role', '==', 'etudiant').where('filiere', '==', db.collection('filiere').doc(filiereId)).get();

    const etudiants = [];
    snapshot.forEach(doc => {
      etudiants.push({ id: doc.id, ...doc.data() });
    });

    res.json(etudiants);
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants de la filière :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des étudiants de la filière.' });
  }
};
exports.getEtudiantsByModule = async (req, res) => {
  try {
    
    const moduleId = req.params.moduleId; // Récupérer l'ID du module depuis les paramètres de la requête

    // Récupérer l'ID de la filière associée à ce module
    const moduleDoc = await db.collection('modules').doc(moduleId).get();
    if (!moduleDoc.exists) {
      return res.status(404).json({ error: 'Module non trouvé.' });
    }

    const filiereId = moduleDoc.data().filiereId;

    // Récupérer tous les étudiants de la filière associée au module spécifié
    const snapshot = await db.collection('users').where('role', '==', 'etudiant').where('filiere', '==', db.collection('filiere').doc(filiereId)).get();

    const etudiants = [];
    snapshot.forEach(doc => {
      etudiants.push({ id: doc.id, ...doc.data() });
    });

    res.json(etudiants);
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants pour le module :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des étudiants pour le module.' });
  }
};exports.getEtudiantsByElementModule = async (req, res) => {
  try {
    const elementModuleId = req.params.elementModuleId;
    console.log("ID de l'élément de module :", elementModuleId); // Ajout du log pour vérifier l'ID

    const elementModuleDoc = await db.collection('elementModule').doc(elementModuleId).get();
    if (!elementModuleDoc.exists) {
      return res.status(404).json({ error: 'Élément de module non trouvé.' });
    }

    const moduleId = elementModuleDoc.data().moduleId.id; // Obtenir l'ID du module à partir de l'objet DocumentReference
    console.log("ID du module associé à l'élément de module :", moduleId); // Ajout du log pour vérifier l'ID du module

    const moduleDoc = await db.collection('modules').doc(moduleId).get();
    if (!moduleDoc.exists) {
      return res.status(404).json({ error: 'Module non trouvé.' });
    }

    const filiereId = moduleDoc.data().filiereId;
    console.log("ID de la filière associée au module :", filiereId); // Ajout du log pour vérifier l'ID de la filière
    if (typeof filiereId !== 'string' || filiereId.trim() === '') {
      return res.status(400).json({ error: 'ID de filière invalide.' });
    }
    
    const snapshot = await db.collection('users').where('role', '==', 'etudiant').where('filiere', '==', db.collection('filiere').doc(filiereId)).get();
    const etudiants = [];
    snapshot.forEach(doc => {
      etudiants.push({ id: doc.id, ...doc.data() });
    });

    res.json(etudiants);
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants pour l\'élément de module :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des étudiants pour l\'élément de module.' });
  }
};
