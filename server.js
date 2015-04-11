var express = require("express");
var bodyParser = require("body-parser");
var errorHandler = require("errorhandler");

var app = express();
var root = __dirname + "/public";

var Pusher = require("pusher");
var pusher = new Pusher({
	appId: "115367",
	key: "cb775456890fa77b26de",
	secret: "a41cce4a6ba2326277e7"
});

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next){
	console.log("%s %s", req.method, req.url);
    console.log(req.body);
	next();
});

app.use(errorHandler({
	dumpExceptions: true,
	showStack: true
}));

app.post("/message", function(req, res) {
	var socketId = req.body.socketId;
    var channel = req.body.channel;
	var message = req.body.message;

	pusher.trigger(channel, "message", message, socketId);

	res.send(200);
});

console.log("Starting Express server");
app.listen(process.env.PORT || 5001);
