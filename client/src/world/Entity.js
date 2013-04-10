MMOTest.Entity = function (game, modelPath, texturePath, scale) {
	MMOTest.Component.call(this, game);
	
	this.modelPath = modelPath;
	this.texturePath = texturePath;
	this.scale = scale;
};

MMOTest.Entity.prototype = Object.create(MMOTest.Component.prototype);

MMOTest.Entity.prototype.loadContent = function (callback) {
	var mapping = new THREE.UVMapping();
	var that = this;
	var texture = THREE.ImageUtils.loadTexture(this.texturePath, mapping, function () {
		var loader = new THREE.JSONLoader();
		loader.load(that.modelPath, function(geo) {			
			geo.computeBoundingBox();
			geo.computeMorphNormals();
			
			that.root = new THREE.Object3D();
			that.root.position.y = -that.scale * geo.boundingBox.min.y;	

			var materialTexture = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 50, wireframe: false, shading: THREE.SmoothShading, map: texture, morphTargets: true, morphNormals: true, metal: true });
			materialTexture.wrapAround = true;

			that.meshBody = new THREE.MorphBlendMesh(geo, materialTexture);
			that.meshBody.rotation.y = -Math.PI/2;

			that.meshBody.scale.set(that.scale, that.scale, that.scale);

			that.root.add(that.meshBody);
			that.game.getScene().add(that.root);
			
			callback();
		});
	});
};