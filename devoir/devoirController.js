const admin = require('firebase-admin');
const db = admin.firestore();

// Créer un devoir
exports.createDevoir = async (req, res) => {
  try {
    const { titre, datedebut, dateFin, file, elementModuleId } = req.body;

    // Ajouter un nouveau devoir à la collection "devoirs" dans Firestore
    const devoirRef = await db.collection('devoirs').add({
      titre,
      datedebut,
      dateFin,
      file,
      elementModuleId
    });

    res.status(201).json({ message: 'Devoir créé avec succès !', id: devoirRef.id });
  } catch (error) {
    console.error('Erreur lors de la création du devoir :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création du devoir.' });
  }
};

// Obtenir tous les devoirs
exports.getAllDevoirs = async (req, res) => {
  try {
    const snapshot = await db.collection('devoirs').get();
    const devoirs = [];
    snapshot.forEach(doc => {
      devoirs.push({ id: doc.id, ...doc.data() });
    });
    res.json(devoirs);
  } catch (error) {
    console.error('Erreur lors de la récupération des devoirs :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des devoirs.' });
  }
};

// Obtenir un devoir par son ID
exports.getDevoirById = async (req, res) => {
  try {
    const devoirId = req.params.id;
    const devoirDoc = await db.collection('devoirs').doc(devoirId).get();

    if (!devoirDoc.exists) {
      res.status(404).json({ error: 'Devoir non trouvé.' });
    } else {
      res.json({ id: devoirDoc.id, ...devoirDoc.data() });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du devoir :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du devoir.' });
  }
};

// Mettre à jour un devoir par son ID
exports.updateDevoir = async (req, res) => {
  try {
    const devoirId = req.params.id;
    const { titre, datedebut, dateFin, file, filiereId, elementModuleId } = req.body;

    await db.collection('devoirs').doc(devoirId).update({
      titre,
      datedebut,
      dateFin,
      file,
      elementModuleId
    });

    res.json({ message: 'Devoir mis à jour avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du devoir :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du devoir.' });
  }
};

// Supprimer un devoir par son ID
exports.deleteDevoir = async (req, res) => {
  try {
    const devoirId = req.params.id;
    await db.collection('devoirs').doc(devoirId).delete();
    res.json({ message: 'Devoir supprimé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la suppression du devoir :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du devoir.' });
  }
};
// Obtient tous les devoirs pour un élément de module spécifique
exports.getDevoirsByElementModuleId = async (req, res) => {
    try {
      const elementModuleId = req.params.elementModuleId; // Récupère l'ID de l'élément de module à partir des paramètres de la requête
  
      // Utilisez une requête pour obtenir tous les devoirs liés à cet élément de module spécifique
      const snapshot = await db.collection('devoirs').where('elementModuleId', '==', elementModuleId).get();
  
      const devoirs = [];
      snapshot.forEach(doc => {
        devoirs.push({ id: doc.id, ...doc.data() });
      });
  
      res.json(devoirs);
    } catch (error) {
      console.error('Erreur lors de la récupération des devoirs pour l\'élément de module :', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des devoirs pour l\'élément de module.' });
    }
  };
  