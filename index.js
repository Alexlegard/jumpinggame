var app = require("express")();
var http = require("http").createServer(app);
var express = require("express");
var io = require("socket.io")(http);
var people = [];
var count;

app.get('/', function(req, res){
  res.sendFile(__dirname + "/sockets.html");
});

app.use(express.static('public'));

io.on("connection", function(socket){
	
	console.log("a user connected");
	//Forces user that just signed in to update list of players
	io.emit("login", people);
	
	socket.on("disconnect", function(){
		console.log("User disconnected");
	});
	
	socket.on("login", function(psn){
		console.log(psn.name + " just logged in.");
		//people.push(person);
		psn.isloggedin = true;
		people.push(psn);
		count = people.length;
		io.emit("login", people, count);
	});
	
	socket.on("logout", function(psn){
		
		for(i = 0; i < people.length; i++){
			if(people[i].name === psn.name){
				people.splice(i, 1);
			}
		}
		count = people.length;
		io.emit("logout", people, count);
	});
	
	socket.on("changeposition", function(psn){
		//if(people.filter(person => person.name === name).length > 0){
		//Is the person index 0 or index 1?
		try {
			//console.log("people[0].name: " + people[0].name + " psn.name: " + psn.name + " psn.x: " + psn.x + " psn.y: " + psn.y);
			if(psn.name === people[0].name){
				people[0] = psn;
				//console.log("people[0].name: " + people[0].name + " people[0].signedin: " + people[0].signedin + " people[0].x: " + people[0].x + " people[0].y: " + people[0].y);
			}
		} catch { /*console.log("Empty array");*/ }
		
		try {
			//console.log("people[1].name: " + people[1].name + " psn.name: " + psn.name);
			if(psn.name === people[1].name){
				people[1] = psn;
			}
		} catch { /*console.log("");*/ }
		
		io.emit("changeposition", people);
	});
	
	socket.on("collision", function(){
		console.log("In collision function");
		try {
			if(ppl[0].x < ppl[1].x){
				ppl[0].score += 1;
				io.emit("collision", ppl);
			} else if(ppl[0].x > ppl[1].x){
				ppl[1].score += 1;
				io.emit("collision", ppl);
			}
		} catch { console.log("Two people are not signed in."); }
	});
});

http.listen(3000, function(){
  console.log("listening on *:3000");
});