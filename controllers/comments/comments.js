const { ObjectId } = require("mongodb");

function getCommentsAsync(restaurant, db) {
  //new ObjectId("").toString()
  let comments = [];
    return new Promise( (resolve, reject) => {
      db.collection('comments')
        .find({ restaurant: new ObjectId(restaurant) })
        .forEach(comment => {
          comments.push(comment)
        })
        .then(() => {
          resolve(comments);
        })
        .catch((err) => {
          console.log(err)
          reject(err);
        });
    })
}

module.exports = {
  getCommentsAsync: getCommentsAsync,
  getComments: (req, res, db) => {
    let restaurant = {...req.body.restaurant};
    getCommentsAsync(restaurant, db)
      .then(() => {
        res.status(200).json(comments);
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({error: 'Could not fetch the documents'});
      });
  },
  getStars:  (comments) => {
    return comments.length ? comments.reduce((acc, curr) => acc + curr.score, 0) / comments.length : 0;
  },
  addComment: (req, res, db) => {
    let comment = {...req.body.comment};
    comment.restaurant = new ObjectId(comment.restaurant);
    comment.user = new ObjectId(comment.user);
    db.collection('restaurants')
      .findOne({ restaurant: comment.restaurant_id })
      .then((restaurant) => {
        console.log(restaurant)
        db.collection("comments")
          .insertOne(comment)
          .then((response) => {
            console.log(response);
            res.status(200).send("Agregado Comment!");
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({error: 'Could not fetch the documents'});
          });
      }). catch((err) => {
        console.log(err);
        res.status(500).json({error: 'Could not fetch the documents'});
      })
  },
  removeComment: (req, res, db) => {
    let comment = req.body.comment_id;
    db.collection("comments")
      .deleteOne({ _id: new ObjectId(comment) })
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