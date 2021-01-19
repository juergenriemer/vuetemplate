const fs = require('fs');
const models = {};
fs.readdirSync("./models").forEach(function (file) {
		let parts = file.split( ".js" );
		if( parts[ 1 ] === "" ) {
				let name = parts[ 0 ];
				if( name != "User" ) models[ name ] = require("../models/" + name );
		}
})
const passport = require('passport');
const passportJWT = require('passport-jwt');

const jwt = require( 'passport-jwt' ).Strategy;
const jwtxxx = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'thisisthesecretkey';


module.exports.controller = app => {

		// create
app.use(passport.initialize());
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

		// filter
		app.get('/rest/:model/:query/:sort/:slice/:fields', passport.authenticate('jwt', { session: false }), (req, res) => {
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
		});



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
}



ClientModels = {
		defaultValue: {
				"String": ""
				, "Number": ""
				, "Boolean": false
		}
		, create() {
				let _models = {};
				for (let name in models) {
						let Model = models[ name].Model;
						console.log( ">>>" + name );
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
				}
				let file = "../frontend/src/services/models.js";
				let content = `const models = ${JSON.stringify(_models, undefined, 4)}\nexport default models;`;
				fs.writeFile(file, content, (x) => { console.log(x); console.log('done') });
		}
}
ClientModels.create();
