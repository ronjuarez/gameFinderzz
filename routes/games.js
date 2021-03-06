/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const { Pool } = require('pg');
const dbParams = require('../lib/db.js');
const db = new Pool(dbParams);
db.connect();

const pool = require('../db/index');

const express = require('express');
const router  = express.Router();
const database = require('../db/database')

module.exports = (db) => {
  router.get("/games/new", (req, res) => {
    const userID = req.session['userid'];
    // if (!userID) {
    //   res.redirect("/login")
    //   return;
    // }
    res.render("game_new", {user: userID});
  });

  router.post("/games/filter", (req, res) => {

      const userID = req.session['userid'];
    // if (!userID) {
    //   res.redirect("/login")
    //   return;
    // }
    database.getUserByID(userID)
    .then(user => {
      if (req.body.filter === 'ascending') {
      database.fetchGamesByPriceAsc()
      .then(games => {
        res.render("index",  {user, games})
      })
      .catch(err => {
        console.log('error message', err.stack);
        return null;
      });
    } else if (req.body.filter === 'descending') {
      database.fetchGamesByPriceDesc()
      .then(games => {
        res.render("index",  {user, games})
      })
      .catch(err => {
        console.log('error message', err.stack);
        return null;
      });
    } else {
      res.redirect('/')
    }
  });
});

router.post("/games/platform", (req, res) => {

  const userID = req.session['userid'];
// if (!userID) {
//   res.redirect("/login")
//   return;
// }
  if (req.body.category) {
    database.getUserByID(userID)
    .then(user => {
      database.fetchGamesByCategory(req.body.category)
      .then(games => {
        res.render("index",  {user, games})
    })
      .catch(err => {
        console.log('error message', err.stack);
        return null;
      });
    });
  } else {
    res.redirect('/')
  }
});

/* THIS IS A ROUTE  */
  router.get("/games/:gameid", (req, res) => {
    const userID = req.session['userid'];
    // const user = getUser(userID)
    // if (!userID) {
    //   res.redirect("/login")
    //   return;
    // }
    const { gameid } = req.params;
    console.log(gameid);
    // const { user } = req.params

    database.getGame(gameid)
    .then(game => {
      const templateVars = { game: game, user: userID }
      console.log(templateVars)
      res.render('game_show', templateVars)
    })
    .catch(e => {
      console.error(e);
      res.send(e)
    })
    // database.getUser({...req.body, id: userID})
    // .then(user => {
    //   res.redirect(`/games/${user.id}`)
    // })
    // let templateVars =  { newGame };
    // res.render("game_show", templateVars);
  });

  router.post("/games", (req, res) => {
    const userID = req.session['userid'];

    database.addNewGame({...req.body, owner_id: userID})
    .then(newGame => {
      console.log(newGame)
    res.redirect(`/games/${newGame.id}`)
    })
    .catch(e => {
      console.error(e);
      res.send(e)
    })
  });



  router.post("/games/:gameID", (req, res) => {
    const userID = req.session['userid'];
    const { gameID } = req.params;

    // need sql update/ set to update values submitted through form
    updateGame(userID, gameID); // this need to be set up

    res.redirect(`/games/:${gameID}`);
  });


  router.post('/favorites', (req, res) => {
    const userID = req.session['userid'];
    const { gameID } = req.body

    // database.getUserByID(userID)
    // .then(user => {
    //   database.isFavorite(gameID,userID)
    //   .then() database.deleteFavorite(gameID, userID) : database.addFavorite(gameID,userID);
    // });

    database.isFavorite(gameID,userID)
    .then(isFaved => {
      if (!isFaved) {
        return database.addFavorite(gameID, userID)
      } else {
        return database.deleteFavorite(gameID, userID);
      }
    })
    .then(() => res.redirect(`/games/${gameID}`))
    .catch(e => {
      console.error(e);
      res.status(500).send(e)
    })
  });

  router.get('/favorites', (req, res) => {
    const userID = req.session['userid'];

    database.getUserByID(userID)
    .then(user => {
      database.fetchFavorites(userID)
      .then(faves => {
        console.log(faves)
        let templateVars = { faves, user }
        console.log(templateVars)
        res.render('favorites', templateVars);
      })
    })
    .catch(e => {
      console.error(e);
      res.status(500).send(e)
    })

    // database.getUserByID(userID)
    // .then(user => {
    //   database.fetchGamesByCategory(req.body.category)
    //   .then(games => {
    //     res.render("index",  {user, games})
    // })

  });

  return router;
};
