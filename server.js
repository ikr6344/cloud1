const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// Middleware pour les données JSON et URL encodées
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes pour chaque collection
const filiereRoutes = require('./Filiere/filiereRoutes');
const etudiantRoutes = require('./Etudiant/etudiantRoutes');
const moduleRoutes = require('./Module/moduleRoutes');
//const noteRoutes = require('./collections/note/noteRoutes');

app.use('/filiere', filiereRoutes);
app.use('/etudiant', etudiantRoutes);
app.use('/module', moduleRoutes);
//app.use('/note', noteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur écoutant sur le port ${PORT}`);
});