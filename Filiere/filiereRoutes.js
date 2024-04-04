const express = require('express');
const router = express.Router();
const filiereController = require('./filiereController');

router.post('/', filiereController.createFiliere);
router.get('/', filiereController.getFiliere);
router.put('/:id', filiereController.updateFiliere);
router.delete('/:id', filiereController.deleteFiliere);
router.get('/:id', filiereController.getFiliereById);

module.exports = router;
