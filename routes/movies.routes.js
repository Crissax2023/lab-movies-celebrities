const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie.model");
const Celebrity = require("../models/Celebrity.model");

router.get("/", (req, res) => {
    Movie.find({}, (err, movies) => {
      if (err) {
        console.log(err);
      } else {
        res.render("movies/movies", { movies });
      }
    });
  });

router.get("/create", (req, res) => {
    Celebrity.find({}, (err, celebrities) => {
      if (err) {
        console.log(err);
      } else {
        res.render("movies/new-movie", { celebrities });
      }
    });
  });

  router.post("/create", (req, res) => {
    const { title, genre, plot, cast } = req.body;
  
    const newMovie = {
      title,
      genre,
      plot,
      cast: Array.isArray(cast) ? cast : [cast],
    };
  
    Movie.create(newMovie, (err, movie) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/movies");
      }
    });
  });


  router.get("/:id", (req, res) => {
    const movieId = req.params.id;
  
    Movie.findById(movieId)
      .populate("cast")
      .then((movie) => {
        res.render("movies/movie-details", { movie });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  
  router.post("/:id/delete", (req, res) => {
    const movieId = req.params.id;
  
    Movie.findByIdAndRemove(movieId)
      .then(() => {
        res.redirect("/movies");
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/movies/", movieId);
      });
  });

  router.get("/:id/edit", (req, res) => {
    const movieId = req.params.id;
  
    Promise.all([Movie.findById(movieId), Celebrity.find()])
      .then(([movie, celebrities]) => {
        res.render("movies/edit-movie", { movie, celebrities });
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/movies/" , movieId);
      });
  });
  

  router.post('/movies/:id', (req, res) => {
    const movieId = req.params.id;
    const { title, genre, plot, cast } = req.body;
  
    Movie.findByIdAndUpdate(movieId, { title, genre, plot, cast })
      .then(() => {
        res.redirect(`/movies/${movieId}`);
      })
      .catch((error) => {
        console.log(error);
        res.redirect(`/movies/${movieId}/edit`);
      });
  });

module.exports = router;