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



const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();


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


const usersRoutes = require("./routes/users");
const gamesRoutes = require("./routes/games");


app.use("/", usersRoutes(db));
app.use("/", gamesRoutes(db));







app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
