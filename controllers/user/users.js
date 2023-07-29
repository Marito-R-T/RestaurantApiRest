const { ObjectId } = require("mongodb");

module.exports = {
  addUser: (req, res, db) => {
    let user = {...req.body.user};
    db.collection("users")
      .insertOne(user)
      .then((response) => {
        console.log(response);
        res.status(200).send("Agregado!");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({error: 'Could not fetch the documents'});
      });
  },
  removeUser: (req, res, db) => {
    let user = req.body.user_id;
    db.collection("users")
      .deleteOne({ _id: new ObjectId(user) })
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