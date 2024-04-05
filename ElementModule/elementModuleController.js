const admin = require('firebase-admin');
const db = admin.firestore();

// Créer un nouvel élément de module
exports.createElementModule = async (req, res) => {
  try {
    const { code, nom, description,pourcentage, moduleId, profId } = req.body;

    // Vérifier si le module existe
    const moduleRef = db.collection('modules').doc(moduleId);
    const moduleDoc = await moduleRef.get();
    if (!moduleDoc.exists) {
      return res.status(404).json({ error: 'Le module spécifié n\'existe pas.' });
    }

    // Vérifier si le professeur existe
    const profRef = db.collection('users').doc(profId);
    const profDoc = await profRef.get();
    if (!profDoc.exists || profDoc.data().role !== 'prof') {
      return res.status(404).json({ error: 'Le professeur spécifié n\'existe pas ou n\'est pas un professeur.' });
    }

    // Ajouter un nouvel élément de module à la collection "elementModule" dans Firestore
    const elementModuleRef = await db.collection('elementModule').add({
      code: code,
      nom: nom,
      description: description,
      pourcentage:pourcentage,
      moduleId: moduleRef,  // Référence directe vers le module
      profId: profRef  // Référence directe vers le professeur
    });

    res.status(201).json({ message: 'Élément de module créé avec succès !', id: elementModuleRef.id });
  } catch (error) {
    console.error('Erreur lors de la création de l\'élément de module :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création de l\'élément de module.' });
  }
};

// Récupérer tous les éléments de module
exports.getAllElementModules = async (req, res) => {
  try {
    const snapshot = await db.collection('elementModule').get();
    const elementModules = [];
    snapshot.forEach(doc => {
      elementModules.push({ id: doc.id, ...doc.data() });
    });
    res.json(elementModules);
  } catch (error) {
    console.error('Erreur lors de la récupération des éléments de module :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des éléments de module.' });
  }
};

// Récupérer un élément de module par son ID
exports.getElementModuleById = async (req, res) => {
  try {
    const elementModuleId = req.params.id;
    const elementModuleDoc = await db.collection('elementModule').doc(elementModuleId).get();

    if (!elementModuleDoc.exists) {
      res.status(404).json({ error: 'Élément de module non trouvé.' });
    } else {
      res.json({ id: elementModuleDoc.id, ...elementModuleDoc.data() });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'élément de module :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'élément de module.' });
  }
};

// Mettre à jour un élément de module par son ID
exports.updateElementModule = async (req, res) => {
  try {
    const elementModuleId = req.params.id;
    const { code, nom, description } = req.body;

    await db.collection('elementModule').doc(elementModuleId).update({
      code: code,
      nom: nom,
      description: description
    });

    res.json({ message: 'Élément de module mis à jour avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'élément de module :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'élément de module.' });
  }
};

// Supprimer un élément de module par son ID
exports.deleteElementModule = async (req, res) => {
  try {
    const elementModuleId = req.params.id;
    await db.collection('elementModule').doc(elementModuleId).delete();
    res.json({ message: 'Élément de module supprimé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'élément de module :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'élément de module.' });
  }
};
