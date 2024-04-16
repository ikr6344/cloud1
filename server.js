const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');
const cors = require('cors'); // Ajoutez cette ligne

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// Middleware pour les données JSON et URL encodées
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ajoutez cette ligne pour activer CORS pour toutes les routes
app.use(cors());

// Routes pour chaque collection
const filiereRoutes = require('./Filiere/filiereRoutes');
const etudiantRoutes = require('./Etudiant/etudiantRoutes');
const moduleRoutes = require('./Module/moduleRoutes');
const noteRoutes = require('./Note/noteRoutes');
const profRoutes = require('./Professeur/profRoutes');
const elementmoduleRoutes = require('./ElementModule/elementModuleRoutes');
const adminRoutes = require('./Admin/adminRoutes');

app.use('/filiere', filiereRoutes);
app.use('/etudiant', etudiantRoutes);
app.use('/module', moduleRoutes);
app.use('/note', noteRoutes);
app.use('/prof', profRoutes);
app.use('/elementModule', elementmoduleRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur écoutant sur le port ${PORT}`);
});
