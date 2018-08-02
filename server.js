// Dependencies
const express = require("express")
const bodyParser = require("body-parser")

const app = express()
const PORT = process.env.PORT || 3000

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Establish routes
require('./app/routing/apiRoutes')(app)
//require('./app/routing/htmlRoutes')(app)

// Listen on specified port for incoming requests
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT)
  });