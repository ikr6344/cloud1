const admin = require('firebase-admin');
const db = admin.firestore();

// Fonction pour créer un nouvel étudiant
exports.createEtudiant = async (req, res) => {
  try {
    const { students, filiereId } = req.body;

    // Vérifier si la filière existe
    const filiereRef = db.collection('filiere').doc(filiereId);
    const filiereDoc = await filiereRef.get();
    if (!filiereDoc.exists) {
      return res.status(404).json({ error: 'La filière spécifiée n\'existe pas.' });
    }

    // Create an array to hold references to the newly created students
    const etudiantRefs = [];

    // Loop through each student in the array and create them
    for (const student of students) {
      // Créer le compte d'authentification Firebase
      const userRecord = await admin.auth().createUser({
        email: student.email,
        password: student.motDePasse,
      });

      // Ajouter un nouvel étudiant à la collection "users" dans Firestore
      const etudiantRef = await db.collection('users').doc(userRecord.uid).set({
        nom: student.nom,
        prenom: student.prenom,
        dateNaissance: student.dateNaissance,
        CIN: student.CIN,
        CNE: student.CNE,
        email: student.email,
        motDePasse: student.motDePasse,
        role: "etudiant",
        photo: student.photo,
        filiere: filiereRef // Référence directe vers la filière
      });

      etudiantRefs.push(etudiantRef.id);
    }

    res.status(201).json({ message: 'Étudiants créés avec succès !', ids: etudiantRefs });
  } catch (error) {
    console.error('Erreur lors de la création des étudiants :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création des étudiants.' });
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
