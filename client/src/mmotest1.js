var MMOTest = {};

window.onload = function () {
	var container = document.createElement('div');
	document.body.appendChild(container);
	
	var stats = new Stats();
	container.appendChild(stats.domElement);
	
	var game = new MMOTest.Game(container);
	game.loadContent();
	
	function render() {
		requestAnimationFrame(render);
		
		var delta = game.clock.getDelta();
		
		game.update(delta);
		game.draw(delta);
		
		stats.update();
	}
	
	render();
};