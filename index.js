//Import des modules nécésaires
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const port = 3000;

//Config du moteur de vues handlebars
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
}));
app.set('view engine', 'hbs');

//Middleware pour parser les données soumises à partir du formulaire
app.use(bodyParser.urlencoded({ extended: true }));

//Routes pour les différentes pages
//Page d'accueil
app.get('/', (req, res) => {
  res.render('index', {layout: 'main'});
});


// Page d'ajout
app.get('/add', (req, res) => {
    res.render('add', {layout: 'main'});
});

// Soumission du formualire pour la page d'ajout
app.post('/add', async (req, res) => {
    try {
        // Récupérer les données soumises à partir du formulaire
        const { username, color, bio } = req.body;
        console.log(req.body);
        console.log('username:', username);
        console.log('color:', color);
        console.log('bio:', bio);

        // Insérer le nouvel utilisateur dans la base de données
        const newUser = await prisma.user.create({
            data: {
                username,
                color,
                bio
            }
        });

        // Répondre avec le nouvel utilisateur créé
        res.json(newUser);
    } catch (error) {
        // Gérer les erreurs
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Error adding user' });
    }
});

//Lancement du serveur
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
