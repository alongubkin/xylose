Xylose.Game = function (container) {
	this.clock = new THREE.Clock();
	this.entities = [];
	
	this.input = new Xylose.Input();

	this.projector = new THREE.Projector();
	
	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.Fog(0xC2F5FF, 1000, 2000);
	
	this.renderer = new THREE.WebGLRenderer({ antialias: true });
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	this.renderer.setClearColor(this.scene.fog.color, 1);
	
	container.appendChild(this.renderer.domElement);
	
	this.renderer.gammaInput = true;
	this.renderer.gammaOutput = true;
	this.renderer.shadowMapEnabled = true;	
	
	this.camera = new Xylose.Camera(this, 45, 1, 4000);
	this.ground = new Xylose.Ground(this);
	this.networkManager = new Xylose.NetworkManager(this);
	
	var that = this;
	window.addEventListener('resize', function (event) {
		that.renderer.setSize(window.innerWidth, window.innerHeight);

		that.getCamera().camera.aspect = window.innerWidth / window.innerHeight;
		that.getCamera().camera.updateProjectionMatrix();
	}, false);
};

Xylose.Game.prototype = {
	getInput: function () {
		return this.input;
	},
	getScene: function () {
		return this.scene;
	},
	getRenderer: function () {
		return this.renderer;
	},
	getProjector: function () {
		return this.projector;
	},
	getCamera: function () {
		return this.camera;
	},
	getGround: function () {
		return this.ground;
	},
	getNetworkManager: function () {
		return this.networkManager;
	},
	loadContent: function () {
		this.ground.loadContent();
	
		for (var entityIndex = 0; entityIndex < this.entities.length; entityIndex++) {
			var entity = this.entities[entityIndex];
			if (entity)
				entity.loadContent();
		}
		
		this.camera.loadContent();
	},
	update: function (delta) {
		this.ground.update();
		
		for (var entityIndex = 0; entityIndex < this.entities.length; entityIndex++) {
			var entity = this.entities[entityIndex];
			if (entity)
				entity.update(delta);
		}
		
		this.camera.update(delta);		
	},
	draw: function (delta) {
		this.ground.draw(delta);
		
		for (var entityIndex = 0; entityIndex < this.entities.length; entityIndex++) {
			var entity = this.entities[entityIndex];
			if (entity)
				entity.draw(delta);
		}

		this.camera.draw(delta);
	}
};