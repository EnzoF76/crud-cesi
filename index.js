// ! Import des modules 
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const port = 3000;

// ! Config Handlebars (moteur de vues)
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
}));
app.set('view engine', 'hbs');

// ! Middleware pour le parsage des données d'un formulaire
app.use(bodyParser.urlencoded({ extended: true }));

// ! Middleware pour le fichier static 
app.use(express.static('public'));

// ! Route index (liste des utilisateurs)
app.get('/', async (req, res) => {
  try {
    // ! Récupérer tous les users de la base
    const users = await prisma.users.findMany();

    // ! Render de la vue avec en paramètres les users
    res.render('index', {layout: 'main', users});
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Error getting users' });
  }
});

// ! Route ajout utilisateur
app.get('/add', (req, res) => {
    res.render('add', {layout: 'main'});
});

// ! Soumission du formualire ajout user
app.post('/add', async (req, res) => {
    try {
        // ! Données du formulaire
        const { username, color, bio } = req.body;

        // ! Insert de l'user dans la base
        const newUser = await prisma.users.create({
            data: {
                username,
                color,
                bio
            }
        });

        // ! Redirection vers l'index si pas d'erreur
        res.redirect('/');
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'un utilisateur :', error);

        // ! Re render de la page pour afficher l'erreur
        res.render('add', {layout: 'main', error: 'Erreur lors de l\'ajout d\'un utilisateur (vérifier que l\'username n\'est pas déjà utilisé)' });
    }
});

// ! Route modification utilisateur
app.get('/edit/:id', async (req, res) => {
    try {
        // ! Récup de l'id dans les paramètres
        const id = parseInt(req.params.id);

        // ! Select dans la base avec l'id de l'user
        const user = await prisma.users.findUnique({
            where: {
                id
            }
        });

        // ! Render de la vue edit avec en paramètre l'user
        res.render('edit', {layout: 'main', user});
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Error getting user' });
    }
});

// ! Soumission du formualire modification user
app.post('/edit/:id', async (req, res) => {
    try {
        // ! Récup de l'id dans les paramètres
        const id = parseInt(req.params.id);

        // ! Récup des données du formulaire
        const { username, color, bio } = req.body;

        // ! Update dans la base
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

        // ! Redirect vers l'index si pas d'erreur
        res.redirect('/');
    } catch (error) {
        console.error('Error updating user:', error);
        
        // ! Re render de la page pour afficher l'erreur
        res.render('edit', {layout: 'main', error: 'Erreur lors de la modification de l\'utilisateur (vérifier que l\'username n\'est pas déjà utilisé)' });
    }
});

// ! Route delete user
app.get('/delete/:id', async (req, res) => {
    try {
        // ! Récup de l'id dans les paramètres
        const id = parseInt(req.params.id);

        // ! Delete de l'user dans la base
        const deletedUser = await prisma.users.delete({
            where: {
                id
            }
        });

        // ! Redirect vers l'index si pas d'erreur
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// ! Lancement du serveur express sur le port 3000
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});