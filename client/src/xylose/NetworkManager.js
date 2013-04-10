Xylose.NetworkManager = function (game) {
	console.log("NetworkManager");
	
	var socket = io.connect('http://localhost:8763');
	socket.emit('login', 'alon', '');
	
	var networkEntities = [];
	var controlling;
	
	function spawn(player, control) {
		console.log('spawn');
		
		var character = new Xylose.Character(game);
		character.loadContent(function () {
			if (control)
				game.getCamera().follow(character);
		});
		
		networkEntities[player.index] = game.entities.push(character) - 1;	
	}
	
	socket.on('spawn_myself', function (player) {
		spawn(player, true);
		controlling = player.index;
	});	
	
	socket.on('world state', function (worldState) {
		for (var x = 0; x < networkEntities.length; x++) {
			var networkEntity = networkEntities[x];
			if (networkEntity) {
				var exists = false;
				for (var y = 0; y < worldState.players.length; y++) {
					if (x === worldState.players[y].index) {
						exists = true;
						break;
					}
				}
				
				if (!exists) {
					game.getScene().remove(game.entities[networkEntity].root);
					
					delete game.entities[networkEntity];
					networkEntities[x] = null;
				}
			}
		}
		
		for (var i = 0; i < worldState.players.length; i++) {
			var player = worldState.players[i];
			
			if (!networkEntities[player.index] && controlling !== player.index) {
				spawn(player, false);
			}
			
			if (!networkEntities[player.index])
				continue;
			
			var entity = game.entities[networkEntities[player.index]];
			
			if (entity && entity.root) {
				var position = new THREE.Vector3(player.position.x, player.position.y, player.position.z);

				if (Math.abs(position.distanceTo(entity.root.position)) > 10) {
					entity.root.position = position;
				}
				
				if (player.walkTo) {
					var walkTo = new THREE.Vector3(player.walkTo.x, player.walkTo.y, player.walkTo.z);
					console.log('received walk message');
					if (!entity.walkTo || (entity.walkTo.x !== walkTo.x || entity.walkTo.z !== walkTo.z)) {
						console.log('walk!');
						entity.walk(walkTo);
						entity.setAnimation(entity.animations.move);
						entity.root.lookAt(walkTo);
					}
				}
			}
		}
	});
	
	document.addEventListener('click', function (event) {
		var camera = game.getCamera().camera;
		
		var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 0.5);
		game.getProjector().unprojectVector(vector, camera);
	
		var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
		var intersects = raycaster.intersectObject(game.getGround().ground);
		
		if (intersects.length > 0) {
			var entity = game.entities[networkEntities[controlling]];
			var target = intersects[0].point;
			target.y = entity.root.position.y;
			
			socket.emit('walk', target);
			
			entity.walk(target);
			entity.setAnimation(entity.animations.move);
			entity.root.lookAt(target);
		}
	}, false);	
}