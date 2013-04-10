Xylose.Keys = {
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	w: 87,
	a: 65,
	s: 83,
	d: 68
};

Xylose.Input = function () {
	var scope = this;
	this.pressedKeys = [];

	function onKeyDown(event) {
		if (!scope.isKeyDown(event.keyCode))
			scope.pressedKeys.push(event.keyCode);
	}
	
	function onKeyUp(event) {
		for (var i = 0; i < scope.pressedKeys.length; i++) {
			if (scope.pressedKeys[i] === event.keyCode)
				delete scope.pressedKeys[i];
		}
	}
	
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);	
};

Xylose.Input.prototype.isKeyDown = function (key) {
	for (var i = 0; i < this.pressedKeys.length; i++) {
		if (key === this.pressedKeys[i])
			return true;
	}
	
	return false;
}