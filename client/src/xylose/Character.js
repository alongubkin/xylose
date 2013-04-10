Xylose.Character = function (game) {
	Xylose.AnimatedEntity.call(this, 
		game,
		"assets/models/animated/ogro/ogro-light.js",
		"assets/models/animated/ogro/skins/grok.jpg",
		1.5,
		{
			move: "run",
			idle: "stand",
			jump: "jump",
			attack: "attack",
			crouchMove: "cwalk",
			crouchIdle: "cstand",
			crouchAttach: "crattack"
		},
		"stand");
	
	this.walkTo = null;
};

Xylose.Character.prototype = Object.create(Xylose.AnimatedEntity.prototype);
/*
Character.prototype.loadContent = function (callback) { 
	var scope = this;
	AnimatedEntity.prototype.loadContent.call(this, function () {
		var shapes, geom, mat, mesh;

		shapes = THREE.FontUtils.generateShapes( "Hello world", {
		  font: "helvetiker",
		  weight: "bold",
		  size: 5
		} );
		geom = new THREE.ShapeGeometry( shapes );
		mat = new THREE.MeshBasicMaterial();
		mesh = new THREE.Mesh( geom, mat );
		
		scope.root.add(mesh);
		mesh.position.y += 50;
		mesh.position.x -= 35;
		callback();
	});
};
*/
Xylose.Character.prototype.update = function (delta) {
	if (this.walkTo) {
		if (Math.abs(this.walkTo.distanceTo(this.root.position)) <= 4) {
			this.setAnimation(this.animations.idle);
			this.walkTo = null;
		} else {	
			var target = this.walkTo;
			var direction = new THREE.Vector3();
			direction.subVectors(this.walkTo, this.root.position);
			direction.normalize();
			
			this.root.position.add(direction.multiplyScalar(150*delta));
		}
	}
};

Xylose.Character.prototype.walk = function (target) {
	this.walkTo = target;
}