const fs = require('fs');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const router = express.Router();
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())


var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/posts');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
		console.log("Connection Succeeded");
});


// root
app.get('/', (req, res) => {
		res.send('template backend')
})

// REST
const rest = require( "./controllers/rest.js" );
rest.controller( app );

app.use( "/", router );
app.listen(8082, '0.0.0.0' )


