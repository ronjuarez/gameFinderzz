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
  return pool.guery(`
  SELECT messages.*, games.title as game_title
  FROM messages JOIN games ON messsages.game_id = games.id
  WHERE shopper_id = $1
  AND game_id = $2 RETURNING *;
  `, [ userID, gameID])
  .then() (res => res.rows[0])
  .catch(err => {
    console.log('error message', err.stack);
    return null;
  })
}
exports.fetchGameMessages = fetchGameMessages;



const sendMessage=  function(newMessage) {
  return pool.query(`
    INSERT INTO messages (
      title,
      text,
      game_id,
      shopper_id,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `, [
    newMessage.title,
    newMessage.text,
    newMessage.game_id,
    newMessage.shopper_id,
    newMessage.created_at
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

// const addProperty = function(newMessage) {
//   const {owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces,number_of_bathrooms, number_of_bedrooms} = newMessage;
//   return pool.query(`
//   INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces,number_of_bathrooms, number_of_bedrooms)
//   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11, $12, $13, $14)
//   RETURNING *`,
//   [owner_id, title, description,thumbnail_photo_url, cover_photo_url,cost_per_night, street, city, province, post_code,country, parking_spaces,number_of_bathrooms,number_of_bedrooms]);
// }
// exports.addProperty = addProperty;

// const deleteGame = function(userID, gameID) {
//   const {owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces,number_of_bathrooms, number_of_bedrooms} = newMessage;
//   return pool.query(`
//   INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces,number_of_bathrooms, number_of_bedrooms)
//   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11, $12, $13, $14)
//   RETURNING *`,
//   [owner_id, title, description,thumbnail_photo_url, cover_photo_url,cost_per_night, street, city, province, post_code,country, parking_spaces,number_of_bathrooms,number_of_bedrooms]);
// }
// exports.addProperty = deleteGame;
