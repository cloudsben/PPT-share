var express = require('express');
var http = require('http');
var fs = require('fs');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var obj = new Array();
var now;

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.get('/chat', function(req, res){
	fs.readFile(__dirname + '/public/chat.html', 'utf8', function(err, text){
		res.send(text);
		res.end();
	});
});

app.get('/ctl', function(req, res){
	fs.readdir(__dirname+'/public/ppt', function(err, files){
		obj = files;
		
	});
	fs.readFile(__dirname + '/public/ctl.html', 'utf8', function(err, text){
		res.send(text);
	});
});

server.listen(3000);

io.sockets.on('connection', function(socket){
	socket.emit('nowimg',{img:now});
	if(obj !== [])
	{
		socket.emit('getimg',{img:obj});
	}
	socket.on('get', function(data){
		socket.broadcast.emit('send',{message:data.message});
	});
	socket.on('sendimg', function(data){
		now = data.img;
		socket.broadcast.emit('clintimg', {img:data.img});
	});
})