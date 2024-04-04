const express = require('express');
const router = express.Router();
const etudiantController = require('./etudiantController');

// Route pour créer un nouvel étudiant
router.post('/', etudiantController.createEtudiant);

// Route pour récupérer tous les étudiants
router.get('/', etudiantController.getAllEtudiants);

// Route pour récupérer un étudiant par son ID
router.get('/:id', etudiantController.getEtudiantById);

// Route pour mettre à jour un étudiant par son ID
router.put('/:id', etudiantController.updateEtudiant);

// Route pour supprimer un étudiant par son ID
router.delete('/:id', etudiantController.deleteEtudiant);

module.exports = router;
