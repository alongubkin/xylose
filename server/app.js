var io = require('socket.io').listen(8763);
var _ = require('underscore');
var THREE = require('three')

var players = [];

io.sockets.on('connection', function (socket) {
	socket.on('login', function (username, password, position) {
		var playerIndex = players.length;
		players[playerIndex] = { index: playerIndex, name: username, position: new THREE.Vector3(0, 36, 0) };
		
		socket.set('index', playerIndex, function () {
			players[playerIndex].ready = true;
			socket.emit('spawn_myself', players[playerIndex]);
		});
	});
	
	socket.on('walk', function (target) {
		socket.get('index', function (err, playerIndex) {
			var player = players[playerIndex];
			if (player && player.ready)
				player.walkTo = new THREE.Vector3(target.x, target.y, target.z);
		});
	});
	
	socket.on('disconnect', function () {
		socket.get('index', function (err, playerIndex) {
			delete players[playerIndex];
		});
	});
});

var clock = new THREE.Clock();

setInterval(function () {
	var delta = clock.getDelta();
	
	for (var i = 0; i < players.length; i++) {
		var player = players[i];
		if (player && player.walkTo) {
			if (Math.abs(player.walkTo.distanceTo(player.position)) <= 4) {
				player.walkTo = null;
			} else {	
				var target = player.walkTo;
				var direction = new THREE.Vector3();
				direction.subVectors(player.walkTo, player.position);
				direction.normalize();
				
				player.position.add(direction.multiplyScalar(150 * delta));
			}
		}
	}
}, 60);

setInterval(function () {	
	var worldState = { players: [] };
	for (var i = 0; i < players.length; i++) {
		if (players[i])
			worldState.players.push(players[i]);
	}
	io.sockets.emit('world state', worldState);
}, 100);