const admin = require('firebase-admin');
const db = admin.firestore();

// Fonction pour créer un nouveau module
exports.createModule = async (req, res) => {
  try {
    const { moduleData, filiereId } = req.body;

    // Vérifier si la filière existe
    const filiereRef = db.collection('filiere').doc(filiereId);
    const filiereDoc = await filiereRef.get();
    if (!filiereDoc.exists) {
      return res.status(404).json({ error: 'La filière spécifiée n\'existe pas.' });
    }

    // Ajouter le module à la collection "modules" dans Firestore
    await db.collection('modules').add({
      code: moduleData.code,
      nom: moduleData.nom,
      semestre: moduleData.semestre,
      filiereId: filiereRef,
      timeStamp: admin.firestore.FieldValue.serverTimestamp()
       // Référence directe vers la filière
    });

    res.status(201).json({ message: 'Module créé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la création du module :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création du module.' });
  }
};


// Fonction pour récupérer tous les modules
exports.getAllModules = async (req, res) => {
  try {
    const snapshot = await db.collection('modules').get();
    const modules = [];
    snapshot.forEach(doc => {
      modules.push({ id: doc.id, ...doc.data() });
    });
    res.json(modules);
  } catch (error) {
    console.error('Erreur lors de la récupération des modules :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des modules.' });
  }
};

// Fonction pour récupérer un module par son ID
exports.getModuleById = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await db.collection('modules').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Module non trouvé' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Erreur lors de la récupération du module par ID :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du module par ID.' });
  }
};

// Fonction pour mettre à jour un module par son ID
exports.updateModule = async (req, res) => {
  try {
    const id = req.params.id;
    const { code, nom, abreviation, filiereId } = req.body;

    await db.collection('modules').doc(id).set({
      code: code,
      nom: nom,
      abreviation: abreviation,
      filiereId: filiereId
    }, { merge: true });

    res.json({ message: 'Module mis à jour avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du module :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du module.' });
  }
};

// Fonction pour supprimer un module par son ID
exports.deleteModule = async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection('modules').doc(id).delete();
    res.json({ message: 'Module supprimé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la suppression du module :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du module.' });
  }
};
// Fonction pour récupérer tous les modules d'une filière
exports.getModulesByFiliere = async (req, res) => {
    try {
      const filiereId = req.params.filiereId;
  
      const snapshot = await db.collection('modules').where('filiereId', '==', filiereId).get();
      const modules = [];
      snapshot.forEach(doc => {
        modules.push({ id: doc.id, ...doc.data() });
      });
      res.json(modules);
    } catch (error) {
      console.error('Erreur lors de la récupération des modules par filière :', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des modules par filière.' });
    }
  };