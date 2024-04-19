const express = require('express');
const router = express.Router();
const elementModuleController = require('./elementModuleController');

// Route pour créer un nouvel élément de module
router.post('/', elementModuleController.createElementModule);
// Route pour récupérer tous les éléments de module
router.get('/', elementModuleController.getAllElementModules);
// Route pour récupérer un élément de module par son ID
router.get('/:id', elementModuleController.getElementModuleById);

// Route pour mettre à jour un élément de module par son ID
router.put('/:id', elementModuleController.updateElementModule);

// Route pour supprimer un élément de module par son ID
router.delete('/:id', elementModuleController.deleteElementModule);
router.get('/elementModules/prof/:profCIN/:AnneeUniversitaire', elementModuleController.getAllElementModulesForProf);
router.get('/elementModule/:code', elementModuleController.getElementModulesByCode);
router.get('/:elementModuleCode/prof', elementModuleController.getProfByElementModuleCode);

module.exports = router;
