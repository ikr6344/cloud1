const express = require('express');
const router = express.Router();
const profController = require('./professeurController');

// Route pour créer un nouveau professeur
router.post('/', profController.createProf);

// Route pour récupérer tous les professeurs
router.get('/', profController.getAllProfs);

// Route pour récupérer un professeur par son ID
router.get('/:id', profController.getProfById);

// Route pour mettre à jour un professeur par son ID
router.put('/:id', profController.updateProf);

// Route pour supprimer un professeur par son ID
router.delete('/:id', profController.deleteProf);

module.exports = router;
