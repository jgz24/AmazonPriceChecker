const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Route that handles /items requests
const itemRoutes = require("./api/routes/items");
//Route that handles /signup request
const userRoutes = require("./api/routes/users");

// Connect to the database
mongoose.connect(
  "mongodb+srv://jgz24:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0-dwus4.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);

//Extracts url encoded data and makes it easily readable
app.use(bodyParser.urlencoded({ extended: false }));
//Extracts json data and makes it easily readable
app.use(bodyParser.json());

/*Route that handles CORS errors.
 *Cors errors happen when client is trying to access
 *data from different server than itself
 */
app.use((req, res, next) => {
  //Give access to any origin
  res.header("Access-Control-Allow-Origin", "*");
  //Which kind of headers we want to accept
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  //Options request occurs before any other request
  //Tells the browser what kind of methods can be sent
  if (req.method === "OPTIONS") {
    res.header("Acess-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});

app.use("/items", itemRoutes);
app.use("/users", userRoutes);

//Error handling if we didn't find a valid route
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

//Error handling for all other errors throughout app
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
