var Player = function (game) {
	Character.call(this, game);
	
	var scope = this;
	document.addEventListener('click', function (event) {
		var camera = scope.game.getCamera().camera;
		
		var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 0.5);
		scope.game.getProjector().unprojectVector(vector, camera);
	
		var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
		var intersects = raycaster.intersectObject(scope.game.getGround().ground);
		
		if (intersects.length > 0) {
			scope.walkTo = intersects[0].point;
			scope.walkTo.y = scope.root.position.y;
			
			scope.setAnimation(scope.animations.move);
			scope.root.lookAt(scope.walkTo);
		}
	}, false);	
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.loadContent = function (callback) {
	var scope = this;
	Character.prototype.loadContent.call(this, function () {
		scope.game.getCamera().follow(scope);
	});
};