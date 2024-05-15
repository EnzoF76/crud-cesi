// NOTE Import des modules nécésaires
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const port = 3000;

// NOTE Config du moteur de vues handlebars
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
}));
app.set('view engine', 'hbs');

// NOTE Middleware pour parser les données soumises à partir du formulaire
app.use(bodyParser.urlencoded({ extended: true }));

// NOTE Middleware pour servir les fichiers statiques
app.use(express.static('public'));

// ! Routes
// NOTE Page d'accueil
app.get('/', async (req, res) => {
  try {
    // Récupérer tous les utilisateurs de la base de données
    const users = await prisma.users.findMany();

    // En rend la vue avec users en paramètre
    res.render('index', {layout: 'main', users});
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Error getting users' });
  }
});

// NOTE Page d'ajout d'un utilisateur
app.get('/add', (req, res) => {
    res.render('add', {layout: 'main'});
});

// NOTE Soumission du formualire pour la page d'ajout
app.post('/add', async (req, res) => {
    try {
        // Récupérer les données soumises à partir du formulaire
        const { username, color, bio } = req.body;

        // Insérer le nouvel utilisateur dans la base de données
        const newUser = await prisma.users.create({
            data: {
                username,
                color,
                bio
            }
        });

        // Répondre avec le nouvel utilisateur créé
        res.redirect('/');
    } catch (error) {
        // Gérer les erreurs
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Error adding user' });
    }
});

// NOTE Page de modification d'un utilisateur
app.get('/edit/:id', async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur à modifier
        const id = parseInt(req.params.id);

        // Récupérer l'utilisateur à modifier
        const user = await prisma.users.findUnique({
            where: {
                id
            }
        });

        // En rend la vue avec user en paramètre
        res.render('edit', {layout: 'main', user});
    } catch (error) {
        // Gérer les erreurs
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Error getting user' });
    }
});

// NOTE Soumission du formualire pour la page de modification
app.post('/edit/:id', async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur à modifier
        const id = parseInt(req.params.id);

        // Récupérer les données soumises à partir du formulaire
        const { username, color, bio } = req.body;

        // Mettre à jour l'utilisateur dans la base de données
        const updatedUser = await prisma.users.update({
            where: {
                id
            },
            data: {
                username,
                color,
                bio
            }
        });

        // Répondre avec l'utilisateur mis à jour
        res.redirect('/');
    } catch (error) {
        // Gérer les erreurs
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
});

// NOTE Suppression d'un utilisateur
app.get('/delete/:id', async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur à supprimer
        const id = parseInt(req.params.id);

        // Supprimer l'utilisateur de la base de données
        const deletedUser = await prisma.users.delete({
            where: {
                id
            }
        });

        // Répondre avec l'utilisateur supprimé
        res.redirect('/');
    } catch (error) {
        // Gérer les erreurs
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

//Lancement du serveur
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});