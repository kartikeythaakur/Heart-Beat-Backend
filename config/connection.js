const mongoose = require("mongoose");

async function ConnectToDB(uri) {
  return await mongoose
    .connect(uri)
    .then((connection) => {
      console.log("Connected to Database");
    })
    .catch((error) => {
      return console.log("Database Error");
    });
}

module.exports = {ConnectToDB}