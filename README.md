# gameFinderzz LHL MidTerm Project
---

gameFinderzz is a multi page NodeJS app where users can post video games for sale, add them to thier favourites and message the seller.

---

## Front-End Stack
* HTML5
* CSS3
* Node.JS

## Back-End Stack
* Express
* PostgresQL

---

# To run gameFinderzz locally:

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Create a DB in PostgresQL.
3. Update the .env file with your correct local information 
  - username: `YOUR USERNAME` 
  - password: `YOUR PASSWORD` 
  - database: `YOUR DB NAME`
4. Install dependencies: `npm i`
5. Fix to binaries for sass: `npm rebuild node-sass`
6. Reset database: `npm run db:reset`
7. Run the server `npm start`


---

# Here is a demonstration of gameFinderzz key features:

---

## On LOAD gameFinderzz returns a list of game posts ordered by most recently posted. In order to access user features you can sign in with test user name `admin@admin.ca` and password `admin`.

![First Screen](https://github.com/ronjuarez/gameFinderzz/blob/master/gifs/browsegameslogin.gif)


## Once users have logged in they can post a new ad and see it show up on the home screen main list.
![Second Screen](https://github.com/ronjuarez/gameFinderzz/blob/master/gifs/postanad.gif)

## By clicking on an ad you can go directly to the game post where you can add the game to your favourites and also send a message about the post. Once you have you will be brough to the conversation thread. The thread a long with other sent messages can always be accessedc by clicking on Inbox. You can also view the games you have fravourited by navigating to the favourites screen. By navigating to my ads you can mark a game as sold and also remove games that you have posted on the list.
![Third Screen](https://github.com/ronjuarez/gameFinderzz/blob/master/gifs/sendmsgmarkfavecheckmsgsfaves.gif)
