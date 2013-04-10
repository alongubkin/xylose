Xylose.Ground = function (game) { 
	this.game = game;
}

Xylose.Ground.prototype = Object.create(Xylose.Component.prototype);

Xylose.Ground.prototype.loadContent = function () {
	this.game.getScene().add( new THREE.AmbientLight( 0xffffff ) );

	var light = new THREE.SpotLight( 0xffffff, 2, 4000 );
	light.position.set( 200, 200, 500 );

	light.castShadow = true;
	light.shadowMapWidth = 1024;
	light.shadowMapHeight = 1024;
	light.shadowMapDarkness = 0.95;
	//light.shadowCameraVisible = true;

	this.game.getScene().add( light );
	
	var gt = THREE.ImageUtils.loadTexture("assets/textures/terrain/grasslight-big.jpg");
	var gg = new THREE.PlaneGeometry(16000, 16000);
	var gm = new THREE.MeshPhongMaterial({ color: 0xffffff, map: gt });

	this.ground = new THREE.Mesh(gg, gm);
	this.ground.rotation.x = - Math.PI / 2;
	this.ground.material.map.repeat.set(64, 64);
	this.ground.material.map.wrapS = this.ground.material.map.wrapT = THREE.RepeatWrapping;
	this.ground.receiveShadow = true;

	this.game.getScene().add(this.ground);
};