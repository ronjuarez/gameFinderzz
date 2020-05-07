/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
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
    database.getUserByID(userID)
    .then(user => {
      database.fetchGames()
      .then(games => {
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
    const {email} = req.body;
    database.getUser(email)
    .then(user => {
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




  // router.post('/favorites', (res, req) => {
  //   const userid = req.session['userid'];
  //   console.log(req.body)
  //   database.addFavorite(userid, )
  // });

  router.get('/users', (req, res) => {
    const userID = req.session['userid'];
    database.getUserByID(userID)
    .then(user => {
      database.getGamesByUserID(userID)
      .then(userGames => {
        let templateVars = { user, userGames }
        res.render('dashboard', templateVars);
      })
    })
  });

  router.get('/messages', (req, res) => {
    const userID = req.session['userid'];

    database.getUserByID(userID)
    .then(user => {

      database.fetchMessages(userID)
      .then(messages => {
        console.log(messages)
        let templateVars = { user, messages }
        res.render('message_inbox', templateVars)
      })
      .catch(e => {
        console.error(e);
        res.send(e)
      })
    })
  });
  +
  router.post("/users/:gameID", (req, res) => {
    const userID = req.session['userid'];
    const { gameID  } = req.params;

    !userID ? res.status(403).send('You are not authorized to change the status for this Game!') :
    database.changeStatus(gameID)
    .then(response => {
      res.redirect(`/users`)
    })
    .catch(e => {
      console.error(e);
      res.send(e)
    })
  });

  router.post('/users/:gameID/delete', (req, res) => {
    const userID = req.session['userid']
    const { gameID } = req.params;

    !userID ? res.status(403).send('You are not authorized to delete this Game!') :
    database.deleteGame(gameID)
    .then(response => {
      res.redirect(`/users`)
    })
    .catch(e => {
      console.error(e);
      res.send(e)
    })
  });

  router.post("/messages/:gameID", (req, res) => {
    const userID = req.session['userid'];
    const { gameID  } = req.params;
    const { text } = req.body;

    database.sendMessage({ text, shopper_id: userID, game_id: gameID })
    .then(newMessage => {
      console.log('newMessage', newMessage)
      res.redirect(`/messages/${newMessage.game_id}`)
    })
    .catch(e => {
      console.error(e);
      res.send(e)
    })
  });

  router.get('/messages/:gameID', (req, res) => {
    const { gameID } = req.params;

    const userID = req.session['userid']

    database.getUserByID(userID)
    .then(user => {
      database.fetchGameMessages(userID, gameID)
      .then(messages => {

        let templateVars = { messages, user, gameID, messageTitle : messages[0].title }
        res.render('game_message', templateVars)
      })
    })
      .catch(e => {
        console.error(e);
        res.send(e)
      })
    })



  return router;
};


