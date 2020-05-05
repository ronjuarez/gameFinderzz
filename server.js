// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  const userID = req.session['userid'];
  // if (!userID) {
  //   res.redirect("/login")
  //   return;
  // }
  res.render("index", {user: userID});
});

// login button/ form on ejs                          should method=POST to action=('/login')
app.get('/login/:userID', (req, res) => {
  req.session.user_id = [req.params.userID];

  res.redirect('/');
});

app.get('/login', (req, res) => {
  const userID = req.session['userid'];
  res.render("login");
});

app.post('/login', (req, res) => {
  const userID = req.session['userid'];
  res.redirect("/");
});

app.post('/logout', (req, res) => {
 req.session = null;
 res.redirect('/');
})

app.get("/games/:gameid", (req, res) => {
  // const userID = req.session['userid'];
  // const user = getUser(userID)
  // if (!userID) {
  //   res.redirect("/login")
  //   return;
  // }
  const { gameID } = req.params;

  getGame(gameID);
  let templateVars =  { user: user };
  res.render("game_show", templateVars);
});

app.get("/games/new", (req, res) => {
  const userID = req.session['userid'];
  if (!userID) {
    res.redirect("/login")
    return;
  }
  res.render("game_new");
});

app.post("/games", (req, res) => {
  const userID = req.session['userid'];
  if (!userID) {
    res.redirect("/login")
    return;
  }

  addNewGame({...req.body, owner_id: userID})
  .then(newGame => {
    res.send(newGame);
  })
  .catch(e => {
    console.error(e);
    res.send(e)
  })

  res.redirect(`/games/${gameID}`); //NOT SURE HOW TO PASS ALONG THE GAME ID OF THE NEWLY CREATED GAME FOR REDIRECT
});

app.post("/games/:gameID/delete", (req, res) => {
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

app.post("/games/:gameID", (req, res) => {
  const userID = req.session['userID'];
  const { gameID } = req.params;

  // need sql update/ set to update values submitted through form
  updateGame(userID, gameID); // this need to be set up

  res.redirect(`/games/:${gameID}`);
});

app.get('/users/:userID/favorites', (req, res) => {
  const userID = req.session['userID'];
  getFavorites(userID);

  res.render('favorites');
});

app.post('/favorites', (req, res) => {
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

app.get('/users/:userID/inbox', (req, res) => {
  const userID = req.session['userid'];
  if (!userID) {
    res.redirect("/login");
    return;
  }
  fetchMessages(userID, messageID); // to be written, will fetch messages from messages table for specific user

  res.render('inbox');
});

app.post('/users/:userID/inbox', (req, res) => {
  sendMessage(userID, message); // to be written, will send message to messages table in DB for specific user

  res.redirect(`/users/${userID}/inbox`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
