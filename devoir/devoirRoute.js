const express = require('express');
const router = express.Router();
const devoirController = require('./devoirController');

// Route pour créer un devoir
router.post('/', devoirController.createDevoir);

// Route pour obtenir tous les devoirs
router.get('/', devoirController.getAllDevoirs);

// Route pour obtenir un devoir par son ID
router.get('/:id', devoirController.getDevoirById);

// Route pour mettre à jour un devoir par son ID
router.put('/:id', devoirController.updateDevoir);

// Route pour supprimer un devoir par son ID
router.delete('/:id', devoirController.deleteDevoir);
router.get('/dev/:elementModuleId', devoirController.getDevoirsByElementModuleId);

module.exports = router;
