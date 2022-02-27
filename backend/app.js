////// Recupération Express et mongoose

const express = require('express');

const mongoose = require('mongoose');
const dotenv = require("dotenv");

// OWASP
const helmet = require("helmet"); // Sécurisation des en-tête 
const mongoSanitize = require('express-mongo-sanitize'); // Sécurisation des entrées de Base données

//importation de fichier des répertoires (méthode NODE)
const path = require('path');

////// Recupération des routes

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

//Variable d'environnement
dotenv.config();
const mongoDb = process.env.DB_CONNECTION;
const MY_PORT = process.env.PORT;
const MY_APP_SECRET = process.env.APP_SECRET;

////// connection à la base données
mongoose.connect(mongoDb,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Securité  OWASP
app.use(helmet()); //Configuration des en-têtes HTTP
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(mongoSanitize()); // controle des entrée avec "$" et "." dans Mongo


app.use(express.json());

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });

// Utilisation des données 

 app.get("/", (req, res) => {
  return res.send(MY_APP_SECRET);
  });
  
app.listen(MY_PORT, () => console.log(`Server running on port ${MY_PORT}`))

// affichage des images 
app.use("/images", express.static(path.join(__dirname,'images'))) 

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

module.exports = app;
