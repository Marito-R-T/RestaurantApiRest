

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
      .sort({ stars: -1 })
      .forEach(restaurant => restaurants.push(restaurant))
      .then(() => {
        res.status(200).json(restaurants);
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({error: 'Could not fetch the documents'});
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
  }
}