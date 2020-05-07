const { Pool } = require('pg');
const dbParams = require('../lib/db.js');
const db = new Pool(dbParams);
db.connect();

const pool = require('./index');
/// Users

const getUser = function(email) {
  console.log('email is here', email);
  return pool.query(`
    SELECT *
    FROM users
    WHERE email = $1;
  `, [`${email}`])
  .then(res => res.rows[0])
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.getUser = getUser;

const getUserByID = function(id) {
  return pool.query(`
    SELECT *
    FROM users
    WHERE id = $1;
  `, [id])
  .then(res => res.rows[0])
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.getUserByID = getUserByID;


const fetchGames = function() {
  return pool.query(`
    SELECT *
    FROM games
    ORDER BY created_at DESC
    LIMIT 10;
  `)
  .then(res => res.rows)
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.fetchGames = fetchGames;

const fetchGamesByPriceAsc = function() {
  return pool.query(`
    SELECT *
    FROM games
    ORDER BY cost;
  `)
  .then(res => res.rows)
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.fetchGamesByPriceAsc = fetchGamesByPriceAsc;

const fetchGamesByPriceDesc = function() {
  return pool.query(`
    SELECT *
    FROM games
    ORDER BY cost DESC;
  `)
  .then(res => res.rows)
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.fetchGamesByPriceDesc = fetchGamesByPriceDesc;

const fetchGamesByCategory = function(category) {
  return pool.query(`
    SELECT *
    FROM games
    WHERE category = $1;
  `, [`${category}`])
  .then(res => res.rows)
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.fetchGamesByCategory = fetchGamesByCategory;

const getGame = function(gameID) {
  return pool.query(`
    SELECT *
    FROM games
    WHERE id = $1;
  `, [`${gameID}`])
  .then(res => {
    console.log(res.rows[0])
    return res.rows[0];
  })
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
  exports.getGame = getGame;

  const addNewGame =  function(newGame) {
    return pool.query(`
      INSERT INTO games (
        owner_id,
        title,
        category,
        description,
        cost,
        photo
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `, [
      newGame.owner_id,
      newGame.title,
      newGame.category,
      newGame.description,
      newGame.cost,
      newGame.photo
      ])
      .then(res => res.rows[0]);
  }
  exports.addNewGame = addNewGame;

const isFavorite = function(gameID, userID) {
  return pool.query(`
    SELECT *
    FROM favorites
    WHERE game_id = $1
    AND shopper_id = $2;
  `, [gameID, userID])
  .then(res => {
    console.log("IS ALREADY FAVORTIED:", res.rows[0])
    return res.rows[0]})
  // .catch(err => {
  //   console.log('error message', err.stack);
  //   return null;
  // })
}
exports.isFavorite = isFavorite;

const deleteFavorite = function(gameID, userID) {
  return pool.query(`
    DELETE FROM favorites
    WHERE game_id = $1
    AND shopper_id = $2;
  `, [gameID, userID])
  .then(res => res.rows[0])
}
exports.deleteFavorite = deleteFavorite;

const addFavorite =  function(gameID, userID) {
  return pool.query(`
  INSERT INTO favorites (game_id, shopper_id)
  VALUES ($1, $2)
  RETURNING *;
  `, [gameID, userID])
  .then(res => {
    console.log("addFavroite FUNCTION RESULT", res.rows[0])
    return res.rows[0]
  })
}
exports.addFavorite = addFavorite;

const fetchFavorites = function(userID) {
  return pool.query(`
  SELECT favorites.*, games.photo as game_photo
  FROM favorites
  JOIN games ON favorites.game_id = games.id
  WHERE shopper_id = $1;
  `, [userID])
  .then(res => res.rows)
}
exports.fetchFavorites = fetchFavorites;

const fetchMessages =  function(userID) {
  return pool.query(`
  SELECT messages.*, games.title as game_title
  FROM messages JOIN games ON  games.id = messages.game_id
  WHERE shopper_id = $1;
  `, [userID])
  .then(res => res.rows)
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.fetchMessages = fetchMessages;

const fetchGameMessages = function(userID, gameID) {
  return pool.query(`
  SELECT messages.*, games.title as game_title
  FROM messages JOIN games ON messages.game_id = games.id
  WHERE shopper_id = $1
  AND game_id = $2;
  `, [ userID, gameID])
  .then(res => {
    console.log('this', res.rows)
    return res.rows
  })
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.fetchGameMessages = fetchGameMessages;

const changeStatus = function(gameID) {
  return pool.query(`
  UPDATE games
  SET is_active = FALSE
  WHERE id = $1;
  `, [gameID])
  .then (res => {
    return res.rows[0]
  })
 .catch(err => {
  console.log('error message', err.stack);
  return null;
  })
};

exports.changeStatus = changeStatus;

const deleteGame = function(gameID) {
  return pool.query(`
  DELETE FROM games
  WHERE id = $1;
  `, [gameID])
  .then (res => {
    return res.rows[0]
  })
 .catch(err => {
  console.log('error message', err.stack);
  return null;
  })
};

exports.deleteGame = deleteGame;

const getGamesByUserID = function(userID) {
  return pool.query(`
    SELECT * FROM games
    WHERE owner_id = $1;
  `, [userID])
  .then(res => {
    return res.rows;
  })
  .catch(err => {
    console.log('error message', err.stack)
    return null;
  })
}
exports.getGamesByUserID = getGamesByUserID;

const sendMessage = function(newMessage) {
  return pool.query(`
    INSERT INTO messages (
      title,
      text,
      game_id,
      shopper_id
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `, [
    'this is a title',
    newMessage.text,
    newMessage.game_id,
    newMessage.shopper_id,
    ])
    .then(res => res.rows[0]);
}
exports.sendMessage = sendMessage;


const addUser =  function(user) {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `, [`${user.name}`, `${user.email}`, `${user.password}`])
  .then(res => res.rows[0])
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.addUser = addUser;
