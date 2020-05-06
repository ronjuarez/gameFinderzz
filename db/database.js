const { Pool } = require('pg');
const dbParams = require('../lib/db.js');
const db = new Pool(dbParams);
db.connect();

const pool = require('./index');
/// Users

const getUser = function(user) {
  return pool.query(`
    SELECT *
    FROM users
    WHERE email = $1;
  `, [email])
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
    FROM users
    WHERE id = $1;
  `, [`${id}`])
  .then(res => res.rows[0])
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.fetchGames = fetchGames;

const getGame = function(gameID) {
  return pool.query(`
    SELECT *
    FROM games
    WHERE id = $1;
  `, [`${gameID}`])
  .then(res => res.rows[0])
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

const isFavorite = function(id) {
  return pool.query(`
    SELECT *
    FROM favorites
    WHERE id = $1;
  `, [`${id}`])
  .then(res => res.rows[0])
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.isFavorite = isFavorite;

const deleteFavorite = function(gameID, userID) {
  return pool.query(`
    SELECT *
    FROM users
    WHERE id = $1;
  `, [`${id}`])
  .then(res => res.rows[0])
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.deleteFavorite = deleteFavorite;

const addFavorite =  function(userID, gameID) {
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
exports.addFavorite = addFavorite;

const fetchMessages =  function(userID) {
  return pool.query(`
  SELECT * FROM messages
  WHERE shopper_id = $1;

  `, [`${userID}`])
  .then(res => res.rows[0])
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.fetchMessages = fetchMessages;

const fetchGameMessages = function(userID, gameID) {
  return pool.guery(`
  SELECT * FROM messages
  WHERE shopper_id = $1
  AND game_id = $2;
  `, [ userID, gameID])
  .then() (res => res.rows[0])
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.fetchGameMessages = fetchGameMessages;

const sendMessage =  function(userID, messageID) {
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
exports.addUser = sendMessage;


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





// const updateGame = function(userID, gameID) {
//   return pool.query(`
//   SELECT properties.*, reservations.*, avg(rating) as average_rating
//   FROM reservations
//   JOIN properties ON properties.id = reservations.property_id
//   JOIN property_reviews ON properties.id = property_reviews.property_id
//   WHERE reservations.guest_id = $1
//   AND reservations.end_date < now()::date
//   GROUP BY properties.id, reservations.id
//   ORDER BY reservations.start_date
//   LIMIT ${limit};
//   `, [guest_id])
//   .then(res => res.rows)
//   .catch(err => {
//     console.log('error message', err.stack);
//     return null;
//   })
// }
// exports.getAllReservations = getAllReservations;

// const getFavorites = function(userID) {
//   return pool.query(`
//   SELECT properties.*, reservations.*, avg(rating) as average_rating
//   FROM reservations
//   JOIN properties ON properties.id = reservations.property_id
//   JOIN property_reviews ON properties.id = property_reviews.property_id
//   WHERE reservations.guest_id = $1
//   AND reservations.end_date < now()::date
//   GROUP BY properties.id, reservations.id
//   ORDER BY reservations.start_date
//   LIMIT ${limit};
//   `, [guest_id])
//   .then(res => res.rows)
//   .catch(err => {
//     console.log('error message', err.stack);
//     return null;
//   })
// }
// exports.getAllReservations = getAllReservations;

// /// Properties

// /**
// //  * Get all properties.
// //  * @param {{}} options An object containing query options.
// //  * @param {*} limit The number of results to return.
// //  * @return {Promise<[{}]>}  A promise to the properties.
// //  */


// //   /* 3Check if a city has been passed in as an option. Add the city to the params array and create a WHERE clause for the city.
// // We can use the length of the array to dynamically get the $n placeholder number. Since this is the first parameter, it will be $1.
// // The % syntax for the LIKE clause must be part of the parameter, not the query. */
// //   if (options.city) {
// //     queryParams.push(`%${options.city}%`);
// //     queryString += `WHERE city LIKE $${queryParams.length} `;
// //   }

// //   if (options.minimum_price_per_night) {
// //     queryParams.push(`${options.minimum_price_per_night}`)
// //     if (queryParams.length === 1) {
// //       queryString += `WHERE properties.cost_per_night/100 >= $${queryParams.length} `;
// //     } else {
// //       queryString += `AND properties.cost_per_night/100 >= $${queryParams.length} `;
// //     }
// //   }

// //   if (options.maximum_price_per_night) {
// //     queryParams.push(`${options.maximum_price_per_night}`)
// //     if (queryParams.length === 1) {
// //       queryString += `WHERE properties.cost_per_night/100 <= $${queryParams.length} `;
// //     } else {
// //       queryString += `AND properties.cost_per_night/100 <= $${queryParams.length} `;
// //     }
// //   }

// //   // 4 Add any query that comes after the WHERE clause.
// //   queryString += `GROUP BY properties.id`

// //   if (options.minimum_rating){
// //       queryParams.push(`${options.minimum_rating}`)
// //       queryString += ` HAVING avg(rating) >= $${queryParams.length} `;
// //     }

// //   queryParams.push(limit);
// //   queryString += `
// //   ORDER BY cost_per_night
// //   LIMIT $${queryParams.length};
// //   `;
// //   // 5 Run the query.
// //   return pool.query(queryString, queryParams)
// //   .then(res => res.rows);
// // // }
// // exports.getAllProperties = getAllProperties;

// const addProperty = function(newGame) {
//   const {owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces,number_of_bathrooms, number_of_bedrooms} = newGame;
//   return pool.query(`
//   INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces,number_of_bathrooms, number_of_bedrooms)
//   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11, $12, $13, $14)
//   RETURNING *`,
//   [owner_id, title, description,thumbnail_photo_url, cover_photo_url,cost_per_night, street, city, province, post_code,country, parking_spaces,number_of_bathrooms,number_of_bedrooms]);
// }
// exports.addProperty = addProperty;

// const deleteGame = function(userID, gameID) {
//   const {owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces,number_of_bathrooms, number_of_bedrooms} = newGame;
//   return pool.query(`
//   INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces,number_of_bathrooms, number_of_bedrooms)
//   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11, $12, $13, $14)
//   RETURNING *`,
//   [owner_id, title, description,thumbnail_photo_url, cover_photo_url,cost_per_night, street, city, province, post_code,country, parking_spaces,number_of_bathrooms,number_of_bedrooms]);
// }
// exports.addProperty = deleteGame;
