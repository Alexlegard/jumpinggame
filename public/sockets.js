/*
Huge thanks to this video for showing me how to make a running/jumping game.
Some of the code I copied but most of it is my own I think. 

https://www.youtube.com/watch?v=8uIt9a2XBrw

by PothOnProgramming, Aug 13, 2017.
*/

window.onload = pageReady;

function pageReady(){
	var name;
	var context;
	var controller;
	var person;
	var person2;
	var people = [];
	var loop;
	var width = 1000;
	var height = 400;
	var horcollision;
	var vertcollision;
	
	document.getElementById("canvas").style.width = width + "px";
	document.getElementById("canvas").style.height= height+ "px";
	
	canvas = {
		width:1000,
		height:400
	}
	
	//Person is a simple Javascript object that we'll
	//manipulate later.
	person = {
		signedin:false,
		name:"anonymous",
		color:"red",
		width:20,
		height:40,
		jumping:false,
		score:0,
		x:500,
		xSpeed:0,
		y:462,
		ySpeed:0,
		left:500,
		right:520,
		bottom:462,
		topp:422
	};
	
	person2 = {
		signedin:false,
		name:"anomymous",
		color:"blue",
		width:20,
		height:40,
		jumping:false,
		score:0,
		x:600,
		xSpeed:0,
		y:462,
		ySpeed:0,
		left:600,
		right:620,
		bottom:462,
		topp:422
	}
	
	//The controller object contains information about the
	//current velocity and has the keyListener function
	controller = {
		
		left:false,
		right:false,
		up:false,
		//Functions can be part of Javascript objects which is
		//what we see here...
		keyListener:function(event){
			var isKeyDown;
			if(event.type === "keydown"){
				isKeyDown = true;
			} else {
				isKeyDown = false;
			}
			
			//Switch event depending on which key is pressed
			//We can also have multiple keys being pressed at the
			//same time which is confusing...
			
			
			switch(event.keyCode){
				
				case 37://Left key
				controller.left = isKeyDown;
				break;
				
				case 38://Up key
				controller.up = isKeyDown;
				break;
				
				case 39://Right key
				controller.right = isKeyDown;
				break;
			}
			
			//If left and right are pressed at once
			if( (controller.left===true) && (controller.right===true) ){
				controller.left = false;
				controller.right = false;
			}
		}
	};
	
	update = function(){
		
		//If left is pressed
		if(controller.left){
			
			if( (person.x + person.xSpeed) < 0 ){
				//alert("Going off left boundary");
				person.xSpeed = 0;
				person.x = 0;
			} else if(person.xSpeed > -10){
				person.xSpeed -= 1;
			}
			person.x += person.xSpeed;
		}
		
		//If right is pressed
		if(controller.right){
			
			//If the next frame will put the person off the screen
			if( (person.x + person.xSpeed) > canvas.width){
				//alert("Going off right boundary");
				person.xSpeed = 0;
				person.x = canvas.width;
			} else if(person.xSpeed < 10){
				person.xSpeed += 1;
			}
			person.x += person.xSpeed;
		}
		
		//If up is pressed
		if( (controller.up) && (person.jumping === false) ){
			person.jumping = true;
			person.ySpeed = -15;
			person.y += person.ySpeed;
		}
		
		//If up is NOT pressed
		if( (person.y < 462) ){
				//alert("In function");
				person.ySpeed += 0.5;
				person.y += person.ySpeed;
		} else if(person.y >= 462) {
			person.jumping = false;
		}
		
		if( (!controller.left) && (!controller.right) ){
			if(person.xSpeed > 0){
				person.xSpeed -= 1;
			}
			if(person.xSpeed < 0){
				person.xSpeed += 1;
			}
			
			person.x += person.xSpeed;
			
			if(person.x < 0){
				person.x = 0;
			}
			if(person.x > canvas.width){
				person.x = canvas.width;
			}
		}
		
		//Draw your player's position every frame and set the bounds
		document.getElementById("person1").style.left = person.x + "px";
		document.getElementById("person1").style.top = person.y + "px";
		person.left = person.x;
		person.right = person.x + person.width;
		person.bottom = person.y
		person.topp = person.y - person.height;
		
		//Write debugging text every frame
		
		document.getElementById("debug").innerHTML =
		"Signed in: " + person.signedin +
		"<br>Name: " + person.name +
		"<br>Jumping: " + person.jumping +
		"<br>Left: " + person.left +
		"<br>Right: " + person.right +
		"<br>Bottom: " + person.bottom +
		"<br>Top: " + person.topp +
		"<br>Y: " + person.y +
		"<br>X speed: " + person.xSpeed +
		"<br>Y speed: " + person.ySpeed +
		"<br>Controller left: " + controller.left +
		"<br>Controller right: " + controller.right +
		"<br>Controller up: " + controller.up +
		"<br>person2 signedin: " + person2.signedin +
		"<br>person2 name: " + person2.name +
		"<br>person2 left: " + person2.left +
		"<br>person2 right: " + person2.right +
		"<br>person2 bottom: " + person2.bottom +
		"<br>person2 top: " + person2.topp;
		
		//Emit the person object every frame
		if(person.signedin === true){
			socket.emit("changeposition", person);
		}
		
		//Do some stuff if both players are signed in
		if(person.signedin && person2.signedin){
			
			//Draw player 2's position
			document.getElementById("person2").style.display = "inline-block";
			document.getElementById("person2").style.left = person2.x + "px";
			document.getElementById("person2").style.top = person2.y + "px";
		}
		
		//if person2.left is between person.left and person.right
		//OR person2.right is between person.left and person.right
		//AND
		//person2.topp is between person.topp and person.bottom
		//OR person2.bottom is between person.topp and person.bottom
		//...then there is a collision.
		if(person.signedin && person2.signedin){
			
			horcollision = ( ((person2.topp >= person.topp) && (person2.topp <= person.bottom)) ||
			((person2.bottom >= person.topp) && (person2.bottom <= person.bottom)) );
			
			vertcollision = ( ((person2.left >= person.left) && (person2.left <= person.right)) ||
			((person2.right >= person.left) && (person2.right <= person.right)) );
			
			//If there's a collision and one player has greater height, that player has
			//jumped on the other player.
			if( (horcollision&&vertcollision) && person.y !== person2.y ){
				//document.getElementById("collision-debug").innerHTML += "<br>Collision!";
				socket.emit("collision");
			}
		}
		//Update recursively calls itself...
		window.requestAnimationFrame(update);
	};
	
	socket.on("changeposition", function(ppl){
		//alert("Hello");
		//alert("ppl[0]: " + ppl[0].name);
		document.getElementById("people-debug").innerHTML = "";
		
		for(var i = 0; i < people.length; i++){
			/*
			document.getElementById("people-debug").innerHTML +=
				"people-debug" +
				"<br>ppl[" + i + "].name: " + ppl[i].name + 
				"<br>ppl[" + i + "].signedin: " + ppl[i].signedin +
				"<br>ppl[" + i + "].x: " + ppl[i].x +
				"<br>ppl[" + i + "].y: " + ppl[i].y;*/
		}
		//If the first person in people is the same (name) as local person
		if(person.name !== ppl[0].name){
			//ppl[0].signedin = true;
			person2 = ppl[0];
		//If the first person in people isn't the same (name) as local person
		//Then update the 2nd player data.
		}
		try {
			if(person.name !== ppl[1].name){
				person2 = ppl[1];
			}
		} catch {
			console.log("Something went wrong");
		}
	});
	
	//Signin function/listener
	document.getElementById("login-form__btn").addEventListener("click", function(){
		name = document.getElementById("login-form__txt").value;
		
		if(person.signedin === true){//If already signed in
			document.getElementById("errmessage").innerHTML = "Already signed in.";
		//If name is empty
		} else if(name === ""){
			document.getElementById("errmessage").innerHTML = "Name cannot be empty.";
		//If two people already in the room
		} else {
			//This line is from https://stackoverflow.com/questions/8217419/how-to-determine-if-javascript-array-contains-an-object-with-an-attribute-that-e/8217584#8217584
			//Answered by CAFxX, Nov 21, 2011.
			if(people.filter(person => person.name === name).length > 0){
				//The same name exists in the array
				document.getElementById("errmessage").innerHTML = "That name is taken by the other player.";
			} else {
				document.getElementById("errmessage").innerHTML = "";
				person.signedin = true;
				document.getElementById("login-form__txt").value = "";
				person.name = name;
				socket.emit("login", person);
			}
		}
	});
	
	//Signout function/listener
	document.getElementById("login-form__logout").addEventListener("click", function(){
		name = person.name;
		
		if( (name !== "") && (name !== null) ){
			socket.emit("logout", person);
		}
	});
	
	/*LISTENERS*/
	
	window.addEventListener("keydown", controller.keyListener);
	window.addEventListener("keyup", controller.keyListener);
	//We use RequestAnimationFrame to continually call a function
	//instead of getTimeOut. We just put the function we wish to
	//call inside the brackets and the RequestAnimationFrame
	//method handles the rest.
	window.requestAnimationFrame(update);
	
	
	/*SOCKET LISTENERS*/
	
	socket.on("login", function(ppl, count){
		people = ppl;
		if(count > 0){
			document.getElementById("player-list__heading").innerHTML = count + " players:";
		}
		document.getElementById("player-list__players").innerHTML = "";
		
		for(var i = 0; i < ppl.length; i++){
			document.getElementById("player-list__players").innerHTML +=
			"<div>" + ppl[i].name + " x: " + ppl[i].x + " y: " + ppl[i].y + "</div>";
		}
	});
	
	socket.on("logout", function(ppl,count){
		people = ppl;
		document.getElementById("player-list__players").innerHTML = "";
		
		if(count > 0){
			document.getElementById("player-list__heading").innerHTML = count + " players:";
		} else {
			document.getElementById("player-list__heading").innerHTML = "No one's here yet.";
		}
		for(var i = 0; i < ppl.length; i++){
			document.getElementById("player-list__players").innerHTML +=
				"<div>" + ppl[i].name + "</div>";
		}
		person.signedin = false;
		person.name = "anonymous";
	});
	
	socket.on("collision", function(ppl){
		
		alert("In collision function");
		people = ppl;
		
		document.getElementById("score__p1").innerHTML =
			ppl[0].name + ": " + ppl[0].score;
		document.getElementById("score__p2").innerHTML =
			ppl[1].name + ": " + ppl[1].score;
	});
}