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

/* THIS IS A ROUTE  */
  router.get("/games/:gameid", (req, res) => {
    // const userID = req.session['userid'];
    // const user = getUser(userID)
    // if (!userID) {
    //   res.redirect("/login")
    //   return;
    // }
    const { gameID } = req.params;

    getGame(gameID);
    getUser(user);
    let templateVars =  { user: user };
    res.render("game_show", templateVars);
  });

  router.post("/games", (req, res) => {
    const userID = req.session['userid'];
    // if (!userID) {
    //   res.redirect("/login")
    //   return;
    // }
    console.log(req.body);

    database.addNewGame({...req.body, owner_id: userID})
    .then(newGame => {
      // res.send(newGame);
      res.redirect(`/games/${newGame.id}`)
    })
    .catch(e => {
      console.error(e);
      res.send(e)
    })

  });

  router.post("/games/:gameID/delete", (req, res) => {
    const userID = req.session['userid'];
    if (!userID) {
      res.redirect("/login")
      return;
    }
    const { gameID } = req.params;

    // add conditional statement so only correct user can delete game
    deleteGame(userID, gameID); // palce holder. will need to crearte function

    res.redirect('/');
  });

  router.post("/games/:gameID", (req, res) => {
    const userID = req.session['userID'];
    const { gameID } = req.params;

    // need sql update/ set to update values submitted through form
    updateGame(userID, gameID); // this need to be set up

    res.redirect(`/games/:${gameID}`);
  });


  router.post('/favorites', (req, res) => {
    const userID = req.session('userID');
    const { gameID } = req.body
    const { source } = req.body

    const result = isFavorite(gameID,userID);
    result ? deleteFavorite(gameID, userID) : addToFavorites(gameID,userID);

    if (source === 'thumbnail') {
      res.redirect('/');
    } else {
      res.redirect(`/games/${gameID}`);
    }
  // its some kind of toggle that passes selected gameid
  //  to users favorite list
  // we want this function to res

  });
  return router;
};
