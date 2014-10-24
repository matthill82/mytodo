/**
 * Created by mhill168 on 24/10/14.
 */

// set up ========================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var morgan = require('morgan'); 			// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================
//mongoose.connect('mongodb://mhill168:Monday11!>@proximus.modulusmongo.net:27017/wutaQ6eh'); 	// connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// Model =======================
var Todo = mongoose.model('Todo', {
	text : String
});

/**
 * HTTP Verb   URL	    Description
	 GET	/api/todos	Get all of the todos
	 POST	/api/todos	Create a single todo
	 DELETE	/api/todos/:todo_id	Delete a single todo
 **/

// Routes =====================
// api ------------------------
// get all todos
app.get('/api/todos', function (req, res) {

	// use mongoose to get all the todos in the database
	Todo.find(function (err, todos) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if(err) res.send(err);

		res.json(todos); // return all todos in json format

	});
});

// create todo and send back all todos after creation
app.post('/api/todos', function (req, res) {

	// create todo, information comes from an ajax request from angular
	Todo.create({
		text : req.body.text,
		done : false
	}, function (err, todo) {

		if(err) res.send(err);

		// get and return all the todos after you create another
		Todo.find(function (err, todos) {
			if(err) res.send(err);

			res.json(err);
		})
	})
});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
	Todo.remove({
		_id : req.params.todo_id
	}, function(err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		Todo.find(function(err, todos) {
			if (err)
				res.send(err)
			res.json(todos);
		});
	});
});


// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");