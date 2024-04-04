const express = require('express');
const router = express.Router();
const moduleController = require('./moduleController');

// Route pour créer un nouveau module
router.post('/', moduleController.createModule);

// Route pour récupérer tous les modules
router.get('/', moduleController.getAllModules);

// Route pour récupérer un module par son ID
router.get('/:id', moduleController.getModuleById);

// Route pour mettre à jour un module par son ID
router.put('/:id', moduleController.updateModule);

// Route pour supprimer un module par son ID
router.delete('/:id', moduleController.deleteModule);
// Route pour récupérer tous les modules d'une filière
router.get('/filiere/:filiereId', moduleController.getModulesByFiliere);


module.exports = router;
