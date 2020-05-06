/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getUser, fetchGames, getUserByID } = require('../db/database')
module.exports = (db) => {
  // router.get("/", (req, res) => {
  //   db.query(`SELECT * FROM users;`)
  //     .then(data => {
  //       const users = data.rows;
  //       res.json({ users });
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });


  /* THIS ROUTE IS MEANT TO GET US TO THE HOME PAGE. THE HOMEPAGE IS SUPPOSED TO HAVE
  1. A DROPDOWN MENU THAT LISTS SIX FEATURE CATEGORIES. THESE ARE NINTENDO 3DS AND ... CATEGORIES ESTABLISHED IN THE WIRFRAME.
  2. A GRID/TABLE CONTAINING TOP 10 ID'S FROM ---(SELECT * FROM games ORDERED BY created_at DESC;)
  3. WE NEED TO FIND A WAY TO IMPLEMENT A JQUERY EVENT LISTENER THAT HAS A TOGGLE FUNCTION FOR OUR FAVORITES BUTTON THAT
  WILL TELL OUR SERVER WIHETHER ONR NOT TO ADD OR DELETE THE ITEM TO THE TABLE.
  */

  router.get("/", (req, res) => {
    const userID = req.session['userid'];
    // if (!userID) {
    //   res.redirect("/login")
    //   return;
    // }
    getUserByID(userID)
    .then(user => {
      fetchGames()
      .then(games => {
        console.log(games);
        res.render("index",  {user, games})
      })
      .catch(err => {
        console.log('error message', err.stack);
        return null;
      })
    })
  });

  // login button/ form on ejs                          should method=POST to action=('/login')
  router.get('/login/:userID', (req, res) => {
    req.session.user_id = [req.params.userID];

    res.redirect('/');
  });

  router.get('/login', (req, res) => {
    const userID = req.session['userid'];
    res.render("login", {user: userID});
  });

  router.post('/login', (req, res) => {
    console.log('req body', req.body);
    const {email} = req.body;
    getUser(email)
    .then(user => {
      console.log('email', user.email);
      req.session['userid'] = user.id;
      res.redirect("/");
    })
    .catch(err => {
      console.log('error message', err.stack);
      return null;
    })
  });

  router.post('/logout', (req, res) => {
   req.session = null;
   res.redirect('/');
  })

  router.get('/messages', (req, res) => {
    const userID = req.session['userid'];
    if (!userID) {
      res.redirect("/login");
      return;
    }
    fetchMessages(userID, messageID); // to be written, will fetch messages from messages table for specific

    res.render('messages');
  });


  router.get('/favorites', (req, res) => {
    const userID = req.session['userID'];
    getFavorites(userID);

    res.render('favorites');
  });

  router.post('/messages', (req, res) => {
    sendMessage(userID, message); // to be written, will send message to messages table in DB for specific

    res.redirect('/messages');
  });

  return router;
};
