const express = require('express');
const { connectToDb, getDb } = require('./db/db');
const { getRestaurants, addRestaurant, removeRestaurant } = require('./controllers/restaurant/restaurants');
const { addComment, removeComment } = require('./controllers/comments/comments');
const { addUser, removeUser } = require('./controllers/user/users');

// init app & middleware
const app = express();

app.use(express.json());

//db connection
let db

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log(`Server Started at ${3000}`)
    });
    db = getDb();
    db.collection('restaurants')
      .createIndex( { location: "2dsphere" } );
  }
});

app.get('/restaurants', (req, res) => {
  getRestaurants(req, res, db);
});

app.post('/restaurants', (req, res) => {
  addRestaurant(req, res, db);
});

app.delete('/restaurants', (req, res) => {
  removeRestaurant(req, res, db);
});

app.post('/comments', (req, res) => {
  addComment(req, res, db);
});

app.delete('/comments', (req, res) => {
  removeComment(req, res, db);
});

app.post('/users', (req, res) => {
  addUser(req, res, db);
});

app.delete('/users', (req, res) => {
  removeUser(req, res, db);
});