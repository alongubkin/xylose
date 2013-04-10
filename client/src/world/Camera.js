MMOTest.Camera = function (game, fov, near, far) {
	this.game = game;
	this.fov = fov;
	this.near = near;
	this.far = far;

	this.angle = Math.PI / 6;
	this.cameraAdditions = new THREE.Vector3();
};

MMOTest.Camera.prototype = Object.create(MMOTest.Component.prototype);

MMOTest.Camera.prototype.loadContent = function () {
	this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, this.near, this.far);
	this.game.getScene().add(this.camera);	
};

MMOTest.Camera.prototype.draw = function (delta) {
	var input = this.game.getInput();
	
	if (input.isKeyDown(MMOTest.Keys.left))
		this.angle += 0.025;
	if (input.isKeyDown(MMOTest.Keys.right))
		this.angle -= 0.025;
	if (input.isKeyDown(MMOTest.Keys.up) && this.camera.position.y <= 450)
		this.cameraAdditions.y += delta * 400;
	if (input.isKeyDown(MMOTest.Keys.down) && this.camera.position.y >= 120)
		this.cameraAdditions.y -= delta * 400;
	
	if (this.entityToFollow) {
		this.camera.position.x = this.entityToFollow.position.x + 450 * Math.cos(this.angle);
		this.camera.position.y = this.entityToFollow.position.y + 450 * Math.sin(Math.PI / 6) + this.cameraAdditions.y;
		this.camera.position.z = this.entityToFollow.position.z + 450 * Math.sin(this.angle);
		
		this.camera.lookAt(this.entityToFollow.position);
	}

	this.game.getRenderer().render(this.game.scene, this.camera);
};

MMOTest.Camera.prototype.follow = function (entity) {
	this.entityToFollow = entity.root;
};