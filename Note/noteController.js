const admin = require('firebase-admin');
const db = admin.firestore();
exports.createNote = async (req, res) => {
  try {
    const { noteControlle, noteExam, elementModuleCode, etudiantCNE, Status } = req.body;

    // Vérifier si l'élément de module existe
    const elementModuleQuery = await db.collection('elementModule').where('code', '==', elementModuleCode).limit(1).get();
    if (elementModuleQuery.empty) {
      return res.status(404).json({ error: 'L\'élément de module spécifié n\'existe pas.' });
    }
    const elementModuleData = elementModuleQuery.docs[0].data();

    // Vérifier si l'étudiant existe
    const etudiantQuery = await db.collection('users').where('CNE', '==', etudiantCNE).where('role', '==', 'etudiant').limit(1).get();
    if (etudiantQuery.empty) {
      return res.status(404).json({ error: 'L\'étudiant spécifié n\'existe pas.' });
    }
    const etudiantData = etudiantQuery.docs[0].data();

    // Ajouter une nouvelle note à la collection "notes" dans Firestore
    await db.collection('notes').add({
      noteControlle: noteControlle,
      noteExam: noteExam,
      elementModuleCode: elementModuleCode,  // Code de l'élément de module
      etudiantCNE: etudiantCNE, // CNE de l'étudiant
      Status: Status 
    });

    res.status(201).json({ message: 'Note créée avec succès !' });
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
// Fonction pour récupérer la note d'un étudiant par son CNE
exports.getNoteByEtudiantCNE = async (req, res) => {
  try {
    const etudiantCNE = req.params.cne; // Récupérer le CNE de l'étudiant depuis les paramètres de la requête

    // Rechercher la note de l'étudiant dans la collection "notes"
    const noteQuery = await db.collection('notes').where('etudiantCNE', '==', etudiantCNE).limit(1).get();

    if (noteQuery.empty) {
      return res.status(404).json({ error: 'La note de l\'étudiant spécifié n\'existe pas.' });
    }

    // Extraire les données de la note
    const noteData = noteQuery.docs[0].data();

    res.json(noteData); // Retourner les données de la note
  } catch (error) {
    console.error('Erreur lors de la récupération de la note de l\'étudiant :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de la note de l\'étudiant.' });
  }
};