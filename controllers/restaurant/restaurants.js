const { getStars, getCommentsAsync } = require('../comments/comments');
const { ObjectId } = require("mongodb");

module.exports = {
  getRestaurants: (req, res, db) => {
    let restaurants = [];
    let filter = {}
    if (req.body.name) {
      const regex = new RegExp(req.body.name, 'i');
      filter.name = { $regex: regex }
    }
    console.log(req.body.coordinates)
    if (req.body.coordinates) {
      filter.location = { $near: 
        {
          $geometry: { type: "Point",  coordinates: req.body.coordinates },
          $maxDistance: 5000
        } 
      }
    }
    db.collection('restaurants')
      .find(filter)
      .forEach((restaurant) => {
        console.log(restaurant)
        restaurants.push(restaurant)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({error: 'Could not fetch the documents'});
      })
      .finally(async () => {
        for (const restaurant of restaurants) {
          console.log(restaurant)
          const comments = await getCommentsAsync(restaurant._id, db);
          console.log(comments)
          restaurant.comments = comments;
          restaurant.stars = getStars(comments);
        }
        res.status(200).json(restaurants);
      });
  },
  addRestaurant: (req, res, db) => {
    let restaurant = {...req.body.restaurant};
    if(restaurant.location) {
      restaurant.location = { type: "Point", coordinates: restaurant.location }
    }
    db.collection("restaurants")
      .insertOne(restaurant)
      .then((response) => {
        console.log(response);
        res.status(200).send("Agregado!");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({error: 'Could not fetch the documents'});
      });
  },
  removeRestaurant: (req, res, db) => {
    let restaurant = req.body.restaurant_id;
    db.collection("restaurants")
      .deleteOne({ _id: new ObjectId(restaurant) })
      .then((response) => {
        console.log(response);
        res.status(200).send("Eliminado!");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({error: 'Could not fetch the documents'});
      });
  }
}