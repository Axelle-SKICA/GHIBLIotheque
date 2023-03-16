//importer express
const express = require("express");

//créer serveur :
const app = express();

//écouter port 4000:
app.listen(4000, () => { console.log("- Port 4000 à l'écoute -") });

//on importe module EJS :
const ejs = require("ejs");

//on paramètre EJS :
app.set('view engine', 'ejs');
app.set('views', './views');

//on rend le dossier public accessiblke de l'extérieur:
app.use(express.static('public'));

//on importe le module "films.json"
const films = require("./films.json");

//Middleware : on détermine le content-type en header de toutes les requêtes
app.use((req, res, next) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    next();
})

//middleware : on passe en locals "films.json" pour que les données soient dispo à chaque requete:
app.use((req, res, next) => {
    res.locals.films = films;
    next();
})

//on crée la route "/":
app.get("/", (req, res) => {
    res.render("index");
})

//on crée la route "/films" :
app.get("/films", (req, res) => {
    res.render("films");
})

//on crée la route paramétrée "/films/:nomFilm" :
app.get("/films/:id", (req, res) => {
    const searchedId = parseInt(req.params.id, 10);
    const searchedFilm = films.find((film) => parseInt(film.id, 10) === searchedId);
    if (searchedFilm) {
        res.render("unFilm", {
            film: searchedFilm,
        });
    }
    else {
        res.statusCode = 404;
        res.render("404")
    }
})

// si la route appelée ne correspond à aucune des précédentes : page 404
app.use((req, res) => {
    res.statusCode = 404;
    res.render("404");
})