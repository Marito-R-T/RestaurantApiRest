const express = require('express');
const { connectToDb, getDb } = require('./db/db');
const { getRestaurants, addRestaurant } = require('./controllers/restaurant/restaurants')

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