const admin = require('firebase-admin');
const db = admin.firestore();
// Créer une nouvelle note
exports.createNote = async (req, res) => {
    try {
      const { note, elementModuleId, etudiantId } = req.body;
  
      // Vérifier si l'élément de module existe
      const elementModuleRef = db.collection('elementModule').doc(elementModuleId);
      const elementModuleDoc = await elementModuleRef.get();
      if (!elementModuleDoc.exists) {
        return res.status(404).json({ error: 'L\'élément de module spécifié n\'existe pas.' });
      }
  
      // Vérifier si l'étudiant existe
      const etudiantRef = db.collection('users').doc(etudiantId);
      const etudiantDoc = await etudiantRef.get();
      if (!etudiantDoc.exists || etudiantDoc.data().role !== 'etudiant') {
        return res.status(404).json({ error: 'L\'étudiant spécifié n\'existe pas.' });
      }
  
      // Ajouter une nouvelle note à la collection "notes" dans Firestore
      const noteRef = await db.collection('notes').add({
        note: note,
        elementModuleRef: elementModuleId,  // Référence directe vers l'élément de module
        etudiantRef: etudiantRef  // Référence directe vers l'étudiant
      });
  
      res.status(201).json({ message: 'Note créée avec succès !', id: noteRef.id });
    } catch (error) {
      console.error('Erreur lors de la création de la note :', error);
      res.status(500).json({ error: 'Erreur serveur lors de la création de la note.' });
    }
  };
  
// Récupérer toutes les notes
exports.getAllNotes = async (req, res) => {
  try {
    const snapshot = await db.collection('notes').get();
    const notes = [];
    snapshot.forEach(doc => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    res.json(notes);
  } catch (error) {
    console.error('Erreur lors de la récupération des notes :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des notes.' });
  }
};

// Récupérer une note par son ID
exports.getNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;
    const noteDoc = await db.collection('notes').doc(noteId).get();

    if (!noteDoc.exists) {
      res.status(404).json({ error: 'Note non trouvée.' });
    } else {
      res.json({ id: noteDoc.id, ...noteDoc.data() });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la note :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de la note.' });
  }
};

// Mettre à jour une note par son ID
exports.updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { note, elementModuleRef, etudiantRef } = req.body;

    // Vérifier si l'élément de module existe
    const elementModuleDoc = await elementModuleRef.get();
    if (!elementModuleDoc.exists) {
      return res.status(404).json({ error: 'L\'élément de module spécifié n\'existe pas.' });
    }

    // Vérifier si l'étudiant existe
    const etudiantDoc = await etudiantRef.get();
    if (!etudiantDoc.exists || etudiantDoc.data().role !== 'etudiant') {
      return res.status(404).json({ error: 'L\'étudiant spécifié n\'existe pas.' });
    }

    await db.collection('notes').doc(noteId).update({
      note: note,
      elementModuleRef: elementModuleRef,
      etudiantRef: etudiantRef
    });

    res.json({ message: 'Note mise à jour avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la note :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la note.' });
  }
};

// Supprimer une note par son ID
exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    await db.collection('notes').doc(noteId).delete();
    res.json({ message: 'Note supprimée avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la note :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de la note.' });
  }
};
