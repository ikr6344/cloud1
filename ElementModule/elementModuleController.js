const admin = require('firebase-admin');
const db = admin.firestore();

// Créer un nouvel élément de module
exports.createElementModule = async (req, res) => {
  try {
    const { code, nom, description, pourcentage, moduleId, profCIN, AnneeUniversitaire } = req.body;

    const moduleQuery = await db.collection('modules').where('code', '==', moduleId).limit(1).get();
    if (moduleQuery.empty) {
      return res.status(404).json({ error: 'Le module spécifié n\'existe pas.' });
    }

    const moduleRef = moduleQuery.docs[0].id;

    // Vérifier si le professeur existe
    const ProfQuery = await db.collection('users').where('CIN', '==', profCIN).where('role', '==', 'prof').limit(1).get();
    if (ProfQuery.empty) {
      return res.status(500).json({ error: 'Le professeur spécifié n\'existe pas.' });
    }
    const profData = ProfQuery.docs[0].data(); // Correction ici

    // Ajouter un nouvel élément de module à la collection "elementModule" dans Firestore
    const elementModuleRef = await db.collection('elementModule').add({
      code: code,
      nom: nom,
      description: description,
      pourcentage: pourcentage,
      AnneeUniversitaire: AnneeUniversitaire,
      moduleId: moduleRef,
      profCIN: profCIN
    });

    res.status(201).json({ message: 'Élément de module créé avec succès !', id: elementModuleRef.id });
  } catch (error) {
    console.error('Erreur lors de la création de l\'élément de module :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création de l\'élément de module.' });
  }
};
exports.getElementModuleByCode = async (req, res) => {
  try {
    const { code } = req.params; // Retrieve the code from the request parameters

    // Perform a query to the database to retrieve the element module corresponding to the specified code
    const elementModuleQuery = await db.collection('elementModule').where('code', '==', code).limit(1).get();

    // Check if an element module was found
    if (elementModuleQuery.empty) {
      return res.status(404).json({ error: 'No element module found for the specified code.' });
    }

    // Retrieve the data of the first element module found and return it as a response
    const doc = elementModuleQuery.docs[0];
    const elementModuleData = doc.data();
    const elementModule = {
      id: doc.id,
      ...elementModuleData
    };

    res.status(200).json(elementModule);
  } catch (error) {
    console.error('Error retrieving element module by code:', error);
    res.status(500).json({ error: 'Server error while retrieving element module by code.' });
  }
};
exports.getAllElementModulesForModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    // Vérifier si le module existe
    const moduleRef = db.collection('modules').doc(moduleId);
    const moduleDoc = await moduleRef.get();
    if (!moduleDoc.exists) {
      return res.status(404).json({ error: 'Le module spécifié n\'existe pas.' });
    }

    // Récupérer tous les éléments de module associés au module spécifié
    const elementModulesQuery = await db.collection('elementModule').where('moduleId', '==', moduleRef).get();
    const elementModules = [];
    elementModulesQuery.forEach(doc => {
      const elementModuleData = doc.data();
      elementModules.push({
        id: doc.id,
        code: elementModuleData.code,
        nom: elementModuleData.nom,
        description: elementModuleData.description,
        pourcentage: elementModuleData.pourcentage,
        AnneeUniversitaire: elementModuleData.AnneeUniversitaire,
        profCIN: elementModuleData.profCIN
      });
    });

    res.status(200).json({ elementModules });
  } catch (error) {
    console.error('Erreur lors de la récupération des éléments de module pour le module spécifié :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des éléments de module.' });
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

// Récupérer tous les éléments de module pour un professeur spécifique
exports.getAllElementModulesForProf = async (req, res) => {
  try {
    const profCIN = req.params.profCIN; // Récupérer l'ID du professeur depuis les paramètres de la requête

    // Effectuer une requête pour récupérer les éléments de module associés à ce professeur
    const snapshot = await db.collection('elementModule').where('profCIN', '==', profCIN).where('AnneeUniversitaire', '==', req.params.AnneeUniversitaire).get();

    const elementModules = [];
    snapshot.forEach(doc => {
      elementModules.push({ id: doc.id, ...doc.data() });
    });

    res.json(elementModules);
  } catch (error) {
    console.error('Erreur lors de la récupération des éléments de module pour ce professeur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des éléments de module.' });
  }
};
exports.getProfByElementModuleCode = async (req, res) => {
  try {
    const elementModuleCode = req.params.elementModuleCode;

    // Recherche de l'élément de module par code
    const elementModuleQuery = await db.collection('elementModule').where('code', '==', elementModuleCode).limit(1).get();

    // Vérification si l'élément de module existe
    if (elementModuleQuery.empty) {
      return res.status(404).json({ error: 'L\'élément de module spécifié n\'existe pas.' });
    }

    // Récupération des données de l'élément de module
    const elementModuleData = elementModuleQuery.docs[0].data();

    // Récupération des informations du professeur en utilisant le CIN du prof stocké dans l'élément de module
    const profCIN = elementModuleData.profCIN;
    const profQuery = await db.collection('users').where('CIN', '==', profCIN).where('role', '==', 'prof').limit(1).get();

    // Vérification si le professeur existe
    if (profQuery.empty) {
      return res.status(404).json({ error: 'Le professeur spécifié n\'existe pas.' });
    }

    // Envoi des informations du professeur en réponse
    const profData = profQuery.docs[0].data();
    res.json(profData);
  } catch (error) {
    console.error('Erreur lors de la récupération du professeur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du professeur.' });
  }
};

exports.getElementsModuleProf = async (req, res) => {
  try {
    const { profCIN } = req.params;

    // Vérifier si le professeur existe
    const profQuery = await db.collection('users').where('CIN', '==', profCIN).where('role', '==', 'prof').limit(1).get();
    if (profQuery.empty) {
      return res.status(404).json({ error: 'Le professeur spécifié n\'existe pas.' });
    }
    const profData = profQuery.docs[0].data();

    // Récupérer les éléments de module associés au professeur
    const elementsModuleQuery = await db.collection('elementModule').where('profCIN', '==', profCIN).get();
    const elementsModule = [];
    elementsModuleQuery.forEach(doc => {
      const elementModule = doc.data();
      elementsModule.push({
        id: doc.id,
        code: elementModule.code,
        nom: elementModule.nom,
        description: elementModule.description,
        pourcentage: elementModule.pourcentage,
        AnneeUniversitaire: elementModule.AnneeUniversitaire,
        moduleId: elementModule.moduleId.id // Correction ici
      });
    });

    res.status(200).json({ elementsModule });
  } catch (error) {
    console.error('Erreur lors de la récupération des éléments de module pour le professeur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des éléments de module pour le professeur.' });
  }
};