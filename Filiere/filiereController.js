// filiereController.js
const admin = require('firebase-admin');
const db = admin.firestore();

exports.createFiliere = async (req, res) => {
  try {
    const { nom, description } = req.body;

    const filiereRef = await db.collection('filiere').add({
      nom: nom,
      description: description,
      timeStamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ message: 'Filière créée avec succès !', id: filiereRef.id });
  } catch (error) {
    console.error('Erreur lors de la création de la filière :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création de la filière.' });
  }
};
// filiereController.js
exports.deleteFiliere = async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection('filiere').doc(id).delete();
    res.json({ message: 'Filière supprimée avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la filière :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de la filière.' });
  }
};
// filiereController.js
exports.updateFiliere = async (req, res) => {
  try {
    const id = req.params.id;
    const { nom, description } = req.body;

    await db.collection('filiere').doc(id).set({
      nom: nom,
      description: description
    }, { merge: true });

    res.json({ message: 'Filière mise à jour avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la filière :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la filière.' });
  }
};
// filiereController.js
exports.getFiliere = async (req, res) => {
  try {
    const snapshot = await db.collection('filiere').get();
    const filieres = [];
    snapshot.forEach(doc => {
      filieres.push({ id: doc.id, ...doc.data() });
    });
    res.json(filieres);
  } catch (error) {
    console.error('Erreur lors de la récupération des filières :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des filières.' });
  }
};
exports.getFiliereById = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await db.collection('filiere').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Filière non trouvée' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Erreur lors de la récupération de la filière par ID :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de la filière par ID.' });
  }
};      