const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const cors = require('cors');
const app = express();

// Définissez vos options CORS
const corsOptions = {
  origin: ['http://localhost:3001', 'https://n-jdykyjkhch4zmxlufj6ixfdhfp2tmn3qv4kblpi-0lu-script.googleusercontent.com'], // Autorisez plusieurs origines
  methods: ['GET', 'POST','DELETE'], // Autorisez les méthodes GET et POST
  credentials: true, // Autorisez l'envoi de cookies avec la demande
};

// Utilisez CORS avec vos options configurées
app.use(cors(corsOptions));

// Middleware pour les données JSON et URL encodées
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes pour chaque collection
const filiereRoutes = require('./Filiere/filiereRoutes');
const etudiantRoutes = require('./Etudiant/etudiantRoutes');
const moduleRoutes = require('./Module/moduleRoutes');
const noteRoutes = require('./Note/noteRoutes');
const profRoutes = require('./Professeur/profRoutes');
const elementmoduleRoutes = require('./ElementModule/elementModuleRoutes');
const adminRoutes = require('./Admin/adminRoutes');
const devoirRoutes = require('./devoir/devoirRoute');

app.use('/filiere', filiereRoutes);
app.use('/etudiant', etudiantRoutes);
app.use('/module', moduleRoutes);
app.use('/note', noteRoutes);
app.use('/prof', profRoutes);
app.use('/elementModule', elementmoduleRoutes);
app.use('/admin', adminRoutes);
app.use('/devoir', devoirRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur écoutant sur le port ${PORT}`);
});
