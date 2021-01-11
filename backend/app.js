const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const models = {
		Post: require("./models/post")
		, Todo : require("./models/todo")
		//  , Machine: require("../models/machine")
}


//const Ping = require('./ping');

var mongoose = require('mongoose');
//const Post = require('../models/post')
mongoose.connect('mongodb://localhost:27017/posts');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
		console.log("Connection Succeeded");
});

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// Pings
/*
app.get('/ping/:host/:port', (req, res) => {
  Ping.test(req.params.port, req.params.host,
	result => res.send(result)
  )
});
*/
// root
app.get('/', (req, res) => {
		res.send('template backend')
})
//
// REST
// create
app.post('/rest/:model', (req, res) => {
		const Model = models[req.params.model].Schema;
		let item = new Model(req.body);
		item.save((error, item) => {
				if( error ) {
						console.log( error.errors );
						res.status(500).send({
								message: error.errors
						});
				}
				else{
						res.send(item);
				}
		})
})

// Fetch all items
app.get('/rest/:model/:query/:sort/:slice/:fields', (req, res) => {
		let query = {};
		let queryString = req.params.query;
		if (queryString) {
				query = JSON.parse(decodeURIComponent(queryString));
				for (let key in query) {
						let val = query[key];
						if (/^\/.*\/$/.test(val)) {
								query[key] = new RegExp(val.slice(1, -1));
						}
				}
		}
		var slice;
		let sort_slice = {};
		let sortString = req.params.sort;
		if (sortString) {
				let _sort = JSON.parse(decodeURIComponent(sortString));
				sort_slice.sort = {};
				sort_slice.sort[_sort.field] = parseInt( _sort.dir );
		}
		let sliceString = req.params.slice;
		if (sliceString) {
				slice = JSON.parse(decodeURIComponent(sliceString));
				sort_slice.limit = parseInt( slice.limit );
				sort_slice.skip = parseInt( slice.skip );
		}
		let fields = [];
		let fieldsString = req.params.fields;
		if (fieldsString) {
				let _fields = JSON.parse(decodeURIComponent(fieldsString));
				fields = _fields;
		}
		const Model = models[req.params.model + ""].Schema;
		Model.countDocuments(query, (error, count) => {
				if (error) {
						res.send(error);
				}
				else {
						Model.find(query, fields, sort_slice, (error, items) => {
								let result = (error) ? { error } : { items, count, ...slice};
								res.send(result);
						});
				}
		});
})


// update
app.put('/rest/:model/:id', (req, res) => {
		const Model = models[req.params.model].Schema;
		Model.findById(req.params.id, (error, item) => {
				Object.assign(item, req.body);
				item.save((error, item) => {
						let result = (error) ? { error } : { item };
						res.send(result);
				})
		})
})


// read
app.get('/rest/:model/:id', (req, res) => {
		const Model = models[req.params.model].Schema;
		const id = req.params.id;
		Model.findById(id, (error, item) => {
				let result = (error) ? { error } : { item };
				res.send(result);
		});
})

// delete
app.delete('/rest/:model/:id', (req, res) => {
		const Model = models[req.params.model].Schema;
		Model.remove({
				_id: req.params.id
		}, (error, item) => {
				let result = (error) ? { error } : { item };
				res.send(result);
		})
})
SchemaCreator = {
		defaultValue: {
				"String": ""
				, "Number": ""
				, "Boolean": false
		}
		, create() {
				let _models = {};
				for (let name in models) {
						let Model = models[ name].Model;
						let empty = Object.keys(Model)
								.reduce((destination, key) => {
										destination[key] = null;
										return destination;
								}, {});
						_models[name] = {
								Model
								, aggregates : {
										empty 
								}
						};

						//let xmodel = models[name].Post2;
						// _models[name] = {
						//   data: {}
						//   , schema: {}
						//   , meta: []
						// };
						// let model = models[name].Schema;
						// for (let field in model.schema.obj) {
						//   let type = model.schema.paths[field].instance;
						//   _models[name].data[field] = this.defaultValue[type];
						//   _models[name].schema[field] = type;
						// }
						// let meta = models[name].Meta;
						// for (let field in model.schema.obj) {
						//   //let displayName = (meta.displayNames[field]) ? meta.displayNames[field] : field;
						//   //_models[name].meta.push({ field, displayName });
						// }
				}

				fs = require('fs');
				let file = "../frontend/src/services/models.js";
				let content = `const models = ${JSON.stringify(_models, undefined, 4)}\nexport default models;`;
				fs.writeFile(file, content, (x) => { console.log(x); console.log('done') });
		}
}
SchemaCreator.create();

//app.listen(process.env.PORT || 8082)
app.listen(8082, '0.0.0.0' )



/*
const { exec } = require("child_process");
	let pings = "xxxxxxxx";
exec("ping 10.0.0.36", (error, stdout, stderr) => {
	if (error) {
		pings = `error: ${error.message}`;
	res.send({
	  pings : pings
	})
		return;
	}
	if (stderr) {
		pings = `stderr: ${stderr}`;
	res.send({
	  pings : pings
	})
		return;
	}
	pings = `stdout: ${stdout}`;
	res.send({
	  pings : pings
	})
});
*/
